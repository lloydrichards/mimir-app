import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { DataPackageProps } from './types/DeviceType';
import { PlantsConfig } from './types/SpaceType';
import { ReadingProps } from './types/ReadingType';


const timestamp = admin.firestore.FieldValue.serverTimestamp();
const db = admin.firestore();

//Sensor Readings
export const sensorReadings = functions.https.onRequest(async (req, res) => {
  //Get readings from sensor
  const data: DataPackageProps = req.body;
  const user = await admin.auth().getUserByEmail(data.auth.email);
  if (!user) {
    res.status(500).send({ message: 'Not authorized to send' });
  }

  const newSensorReading = db.collection('mimirReadings').doc();
  const spaceDoc = db
    .collectionGroup('Configs')
    .where('current', '==', true)
    .where(`devices`, 'array-contains', data.auth.device_id);
  // const deviceDoc = db.collection('mimirDevices').doc(data.auth.device_id);

  try {
    await db
      .runTransaction(async (t) => {
        const space = await t.get(spaceDoc);
        // const device = await t.get(deviceDoc);
        const space_id = space.docs.map((i) => i.ref.parent.parent?.id || null);
        const species_id = [
          ...new Set(
            space.docs
              .map((i) => {
                const speciesArr = [];
                for (const [_, value] of Object.entries(i.data().plants)) {
                  speciesArr.push((value as PlantsConfig).botanical_name);
                }
                return speciesArr;
              })
              .reduce((acc, val) => acc.concat(val), [])
          ),
        ];
        const reading: ReadingProps = {
          user_id: user.uid,
          device_id: data.auth.device_id,
          space_id,
          species_id,
          timestamp,
          bootCount: data.status.bootCount,
          temperature: data.data.temperature,
          humidity: data.data.humidity,
          pressure: data.data.pressure,
          altitude: data.data.altitude,
          luminance: data.data.luminance,
          iaq: data.data.iaq,
          iaqAccuracy: data.data.iaqAccuracy,
          eVOC: data.data.eVOC,
          eCO2: data.data.eCO2,
          bearing: data.data.bearing,
          batteryVoltage: data.data.batteryVoltage,
          batteryPercent: data.data.batteryPercent,
        };

        t.set(newSensorReading, reading);
      })
      .then(() =>
        res.status(200).json({
          response: 'Success',
          user_id: user.uid,
        })
      );
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
