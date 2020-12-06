import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { initUserAgg, initUserDoc } from './initDocs/users';
import { DataPackage } from './Model/sensor';
import { ConfigPlants } from './Model/space';
import { initDeviceAgg, initDeviceDoc } from './initDocs/device';
import { initSpaceAgg, initSpaceConfig } from './initDocs/space';

admin.initializeApp();
const timestamp = admin.firestore.FieldValue.serverTimestamp();
const increment = admin.firestore.FieldValue.increment;

const db = admin.firestore();
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

//Users
export const userCreated = functions.auth.user().onCreate((user) => {
  //New Auth User created
  const batch = db.batch();

  const newUser = db.collection('mimirUsers').doc(user.uid);
  const newAgg = newUser.collection('Aggs').doc('--init--');
  const newLog = newUser.collection('Logs').doc();
  const stats = db.collection('mimirUsers').doc('--stats--');

  const initUserLog = {
    timestamp,
    type: ['USER_CREATED'],
    content: {
      user_id: user.uid,
      user_email: user.email,
    },
  };

  batch.set(newUser, initUserDoc(user.email || '', timestamp), { merge: true });
  batch.set(newAgg, initUserAgg(timestamp));
  batch.set(newLog, initUserLog);
  batch.set(
    stats,
    {
      users_total: increment(1),
      last_added: timestamp,
    },
    { merge: true }
  );

  return batch.commit();
});

export const userUpdated = functions.firestore
  .document('mimirUsers/{user_id}')
  .onUpdate((user) => {
    const batch = db.batch();
    const userBefore = user.before;
    const userAfter = user.after;

    const stats = db.collection('mimirUsers').doc('--stats--');
    batch.set(
      stats,
      {
        gardener: {
          [userBefore.data().gardener || 'undefined']: increment(-1),
          [userAfter.data().gardener || 'undefined']: increment(1),
        },
        subscription: {
          [userBefore.data().subscription || 'undefined']: increment(-1),
          [userAfter.data().subscription || 'undefined']: increment(1),
        },
        region: {
          [userBefore.data().location.region || 'undefined']: increment(-1),
          [userAfter.data().location.region || 'undefined']: increment(1),
        },
        country: {
          [userBefore.data().location.country || 'undefined']: increment(-1),
          [userAfter.data().location.country || 'undefined']: increment(1),
        },
        city: {
          [userBefore.data().location.city || 'undefined']: increment(-1),
          [userAfter.data().location.city || 'undefined']: increment(1),
        },
      },
      { merge: true }
    );
    return batch.commit();
  });
//Devices
export const deviceCreated = functions.firestore
  .document('mimirDevices/{device_id}')
  .onCreate((device) => {
    //device Added
    const batch = db.batch();

    const newDevice = db.collection('mimirDevices').doc(device.id);
    const newAgg = newDevice.collection('Aggs').doc('--init--');
    const newLog = newDevice.collection('Logs').doc();
    const stats = db.collection('mimirDevices').doc('--stats--');

    const initDeviceLog = {
      timestamp,
      type: ['DEVICE_CREATED'],
      content: {
        device_id: device.id,
      },
    };

    batch.set(newDevice, initDeviceDoc(timestamp), { merge: true });
    batch.set(newAgg, initDeviceAgg(timestamp));
    batch.set(newLog, initDeviceLog);
    batch.set(
      stats,
      {
        devices_total: increment(1),
        hardware: { [device.data().version.hardware]: increment(1) },
        software: { [device.data().version.software]: increment(1) },
        last_added: timestamp,
      },
      { merge: true }
    );

    return batch.commit();
  });

export const deviceUpdated = functions.firestore
  .document('mimirDevices/{device_id}')
  .onUpdate((device) => {
    const batch = db.batch();
    const deviceBefore = device.before;
    const deviceAfter = device.after;

    const stats = db.collection('mimirDevices').doc('--stats--');
    batch.set(
      stats,
      {
        hardware: {
          [deviceBefore.data().hardware || 'undefined']: increment(-1),
          [deviceAfter.data().hardware || 'undefined']: increment(1),
        },
        software: {
          [deviceBefore.data().software || 'undefined']: increment(-1),
          [deviceAfter.data().software || 'undefined']: increment(1),
        },
      },
      { merge: true }
    );
    return batch.commit();
  });

//Spaces
export const spaceCreated = functions.firestore
  .document('mimirSpaces/{space_id}')
  .onCreate((space) => {
    //device Added
    const batch = db.batch();

    const newSpace = db.collection('mimirSpaces').doc(space.id);
    const newAgg = newSpace.collection('Aggs').doc('--init--');
    const newConfig = newSpace.collection('Configs').doc('--init');
    const newLog = newSpace.collection('Logs').doc();
    const stats = db.collection('mimirSpaces').doc('--stats--');

    const initSpaceLog = {
      timestamp,
      type: ['SPACE_CREATED'],
      content: {
        device_id: space.id,
        created_by: space.data().created_by,
      },
    };

    batch.set(newAgg, initSpaceAgg(timestamp));
    batch.set(newConfig, initSpaceConfig(timestamp));
    batch.set(newLog, initSpaceLog);
    batch.set(
      stats,
      {
        spaces_total: increment(1),
        room_type: { [space.data().room_type]: increment(1) },
        sun_exposure: { [space.data().sun_exposure]: increment(1) },
        region: { [space.data().location.region]: increment(1) },
        country: { [space.data().location.country]: increment(1) },
        city: { [space.data().location.city]: increment(1) },
        last_added: timestamp,
      },
      { merge: true }
    );

    return batch.commit();
  });

export const spaceUpdated = functions.firestore
  .document('mimirSpaces/{space_id}')
  .onUpdate((space) => {
    const batch = db.batch();
    const spaceBefore = space.before;
    const spaceAfter = space.after;

    const stats = db.collection('mimirSpaces').doc('--stats--');
    batch.set(
      stats,
      {
        room_type: {
          [spaceBefore.data().room_type || 'undefined']: increment(-1),
          [spaceAfter.data().room_type || 'undefined']: increment(1),
        },
        sun_exposure: {
          [spaceBefore.data().sun_exposure || 'undefined']: increment(-1),
          [spaceAfter.data().sun_exposure || 'undefined']: increment(1),
        },
        region: {
          [spaceBefore.data().location.region || 'undefined']: increment(-1),
          [spaceAfter.data().location.region || 'undefined']: increment(1),
        },
        country: {
          [spaceBefore.data().location.country || 'undefined']: increment(-1),
          [spaceAfter.data().location.country || 'undefined']: increment(1),
        },
        city: {
          [spaceBefore.data().location.city || 'undefined']: increment(-1),
          [spaceAfter.data().location.city || 'undefined']: increment(1),
        },
      },
      { merge: true }
    );
    return batch.commit();
  });

//Sensor Readings
export const sensorReadings = functions.https.onRequest(async (req, res) => {
  //Get readings from sensor
  const data: DataPackage = req.body;
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
        const space_id = space.docs.map((i) => i.ref.parent.parent?.id);
        const species_ids = [
          ...new Set(
            space.docs
              .map((i) => {
                const speciesArr = [];
                for (const [_, value] of Object.entries(i.data().plants)) {
                  speciesArr.push((value as ConfigPlants).botanical_name);
                }
                return speciesArr;
              })
              .reduce((acc, val) => acc.concat(val), [])
          ),
        ];
        const reading = {
          user_id: user.uid,
          device_id: data.auth.device_id,
          space_id,
          species_ids,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
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
