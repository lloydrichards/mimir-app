import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { DataPackageProps } from './types/DeviceType';
import { PlantsConfig } from './types/SpaceType';
import { ReadingProps } from './types/ReadingType';
import { FirebaseTimestamp } from './types/GenericType';

const timestamp = admin.firestore.FieldValue.serverTimestamp() as FirebaseTimestamp;
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
        const space_ids: Array<string> = [];
        space.docs.forEach((i) =>
          i.ref.parent.parent ? space_ids.push(i.ref.parent.parent?.id) : null
        );
        const plants_ids = [
          ...new Set(
            space.docs
              .map((i) => {
                const speciesArr = [];
                for (const [_, value] of Object.entries(i.data().plants)) {
                  speciesArr.push((value as PlantsConfig).id);
                }
                return speciesArr;
              })
              .reduce((acc, val) => acc.concat(val), [])
          ),
        ];
        const species_ids = [
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
          space_ids,
          plants_ids,
          species_ids,
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

const minReading = (
  readings: Array<ReadingProps>,
  key: 'temperature' | 'humidity' | 'luminance' | 'iaq' | 'eVOC' | 'eCO2'
): number => {
  return readings.reduce(
    (acc, cur) => (cur[key] < acc ? cur[key] : acc === 0 ? cur[key] : acc),
    0
  );
};
const maxReading = (
  readings: Array<ReadingProps>,
  key: 'temperature' | 'humidity' | 'luminance' | 'iaq' | 'eVOC' | 'eCO2'
): number => {
  return readings.reduce((acc, cur) => (cur[key] > acc ? cur[key] : acc), 0);
};
const avgReading = (
  readings: Array<ReadingProps>,
  key: 'temperature' | 'humidity' | 'luminance' | 'iaq' | 'eVOC' | 'eCO2'
): number => {
  return readings.reduce((acc, cur) => acc + cur[key], 0) / readings.length;
};
const totalHrReadings = (
  readings: Array<ReadingProps>,
  key: 'temperature' | 'humidity' | 'luminance' | 'iaq' | 'eVOC' | 'eCO2',
  min: number,
  max: number
): number => {
  return readings.reduce((total, cur) => {
    return cur[key] >= min && cur[key] < max ? total + 0.25 : total;
  }, 0);
};

export const dailyReading = functions.pubsub
  .schedule('0 0 * * *')
  .onRun(async (context) => {
    console.log('Running daily reading calculator');
    return db
      .runTransaction(async (t) => {
        const last24hr = new Date(
          admin.firestore.Timestamp.now().toMillis() - 24 * 60 * 60 * 1000
        );
        const readings = (
          await t.get(
            db.collection('mimirReadings').where('timestamp', '>', last24hr)
          )
        ).docs.map((i) => i.data()) as Array<ReadingProps>;

        const plant_ids = [
          ...new Set(
            readings
              .map((i) => {
                const plantArr: Array<string> = [];
                i.plants_ids.forEach((id) => plantArr.push(id));
                return plantArr;
              })
              .reduce((acc, val) => acc.concat(val), [])
          ),
        ];
        const space_ids = [
          ...new Set(
            readings
              .map((i) => {
                const spaceArr: Array<string> = [];
                i.space_ids.forEach((id) => spaceArr.push(id));
                return spaceArr;
              })
              .reduce((acc, val) => acc.concat(val), [])
          ),
        ];

        space_ids.forEach((space_id) => {
          console.log('For Each Space');
          const dReading = db
            .collection('mimirSpaces')
            .doc(space_id)
            .collection('Daily')
            .doc(admin.firestore.Timestamp.now().toDate().toDateString());

          const filteredReading = readings.filter((i) =>
            i.space_ids.includes(space_id)
          );

          const temperature = {
            min: minReading(filteredReading, 'temperature'),
            max: maxReading(filteredReading, 'temperature'),
            avg: avgReading(filteredReading, 'temperature'),
          };
          const humidity = {
            min: minReading(filteredReading, 'humidity'),
            max: maxReading(filteredReading, 'humidity'),
            avg: avgReading(filteredReading, 'humidity'),
          };
          const light = {
            low: totalHrReadings(filteredReading, 'luminance', 250, 2500),
            medium: totalHrReadings(filteredReading, 'luminance', 2500, 10000),
            bright: totalHrReadings(filteredReading, 'luminance', 10000, 20000),
            full: totalHrReadings(filteredReading, 'luminance', 20000, 100000),
            avg: avgReading(
              filteredReading.filter((i) => i.luminance > 0),
              'luminance'
            ),
            max: maxReading(
              filteredReading.filter((i) => i.luminance > 0),
              'luminance'
            ),
          };
          const air = {
            max: maxReading(
              filteredReading.filter((a) => a.iaqAccuracy === 3),
              'iaq'
            ),
            avg: avgReading(
              filteredReading.filter((a) => a.iaqAccuracy === 3),
              'iaq'
            ),
          };
          const data = filteredReading.reduce((acc, cur) => {
            const newAcc = acc;
            const hour = cur.timestamp.toDate().getHours();
            const hourData = acc[hour];
            newAcc[hour] = {
              total: (hourData?.total || 0) + 1,
              timestamp: cur.timestamp,
              temperature:
                ((hourData?.temperature || 0 * (hourData?.total || 1)) +
                  cur.temperature) /
                ((hourData?.total || 0) + 1),
              humidity:
                ((hourData?.humidity || 0 * (hourData?.total || 1)) +
                  cur.humidity) /
                ((hourData?.total || 0) + 1),
              iaq:
                ((hourData?.iaq || 0 * (hourData?.total || 1)) + cur.iaq) /
                ((hourData?.total || 0) + 1),
              eCO2:
                ((hourData?.eCO2 || 0 * (hourData?.total || 1)) + cur.eCO2) /
                ((hourData?.total || 0) + 1),
              eVOC:
                ((hourData?.eVOC || 0 * (hourData?.total || 1)) + cur.eVOC) /
                ((hourData?.total || 0) + 1),
              luminance:
                ((hourData?.luminance || 0 * (hourData?.total || 1)) +
                  cur.luminance) /
                ((hourData?.total || 0) + 1),
            };
            return newAcc;
          }, {} as DailyReadingData);

          t.set(dReading, {
            timestamp,
            temperature,
            humidity,
            air,
            light,
            data,
          });
        });
        plant_ids.forEach((plant_id) => {
          const dReading = db
            .collection('mimirPlants')
            .doc(plant_id)
            .collection('Daily')
            .doc(admin.firestore.Timestamp.now().toDate().toDateString());
          const filteredReading = readings.filter((i) =>
            i.plants_ids.includes(plant_id)
          );

          const temperature = {
            min: minReading(filteredReading, 'temperature'),
            max: maxReading(filteredReading, 'temperature'),
            avg: avgReading(filteredReading, 'temperature'),
          };
          const humidity = {
            min: minReading(filteredReading, 'humidity'),
            max: maxReading(filteredReading, 'humidity'),
            avg: avgReading(filteredReading, 'humidity'),
          };
          const light = {
            low: totalHrReadings(filteredReading, 'luminance', 250, 2500),
            medium: totalHrReadings(filteredReading, 'luminance', 2500, 10000),
            bright: totalHrReadings(filteredReading, 'luminance', 10000, 20000),
            full: totalHrReadings(filteredReading, 'luminance', 20000, 100000),
            avg: avgReading(
              filteredReading.filter((i) => i.luminance > 0),
              'luminance'
            ),
            max: maxReading(
              filteredReading.filter((i) => i.luminance > 0),
              'luminance'
            ),
          };
          const air = {
            max: maxReading(
              filteredReading.filter((a) => a.iaqAccuracy === 3),
              'iaq'
            ),
            avg: avgReading(
              filteredReading.filter((a) => a.iaqAccuracy === 3),
              'iaq'
            ),
          };
          const data = filteredReading.reduce((acc, cur) => {
            const newAcc = acc;
            const hour = cur.timestamp.toDate().getHours();
            const hourData = acc[hour];
            newAcc[hour] = {
              total: (hourData?.total || 0) + 1,
              timestamp: cur.timestamp,
              temperature:
                ((hourData?.temperature || 0 * (hourData?.total || 1)) +
                  cur.temperature) /
                ((hourData?.total || 0) + 1),
              humidity:
                ((hourData?.humidity || 0 * (hourData?.total || 1)) +
                  cur.humidity) /
                ((hourData?.total || 0) + 1),
              iaq:
                ((hourData?.iaq || 0 * (hourData?.total || 1)) + cur.iaq) /
                ((hourData?.total || 0) + 1),
              eCO2:
                ((hourData?.eCO2 || 0 * (hourData?.total || 1)) + cur.eCO2) /
                ((hourData?.total || 0) + 1),
              eVOC:
                ((hourData?.eVOC || 0 * (hourData?.total || 1)) + cur.eVOC) /
                ((hourData?.total || 0) + 1),
              luminance:
                ((hourData?.luminance || 0 * (hourData?.total || 1)) +
                  cur.luminance) /
                ((hourData?.total || 0) + 1),
            };
            return newAcc;
          }, {} as DailyReadingData);

          t.set(dReading, {
            timestamp,
            temperature,
            humidity,
            air,
            light,
            data,
          });
        });
      })
      .catch((err) => console.error(err));
  });

export const readingTest = functions.https.onCall(async (context) => {
  console.log('Running daily reading calculator');
  return db
    .runTransaction(async (t) => {
      const last24hr = new Date(
        admin.firestore.Timestamp.now().toMillis() - 24 * 60 * 60 * 1000
      );
      const readings = (
        await t.get(
          db.collection('mimirReadings').where('timestamp', '>', last24hr)
        )
      ).docs.map((i) => i.data()) as Array<ReadingProps>;

      const plant_ids = [
        ...new Set(
          readings
            .map((i) => {
              const plantArr: Array<string> = [];
              i.plants_ids.forEach((id) => plantArr.push(id));
              return plantArr;
            })
            .reduce((acc, val) => acc.concat(val), [])
        ),
      ];
      const space_ids = [
        ...new Set(
          readings
            .map((i) => {
              const spaceArr: Array<string> = [];
              i.space_ids.forEach((id) => spaceArr.push(id));
              return spaceArr;
            })
            .reduce((acc, val) => acc.concat(val), [])
        ),
      ];

      space_ids.forEach((space_id) => {
        console.log('For Each Space');
        const dReading = db
          .collection('mimirSpaces')
          .doc(space_id)
          .collection('Daily')
          .doc(admin.firestore.Timestamp.now().toDate().toDateString());

        const filteredReading = readings.filter((i) =>
          i.space_ids.includes(space_id)
        );

        const temperature = {
          min: minReading(filteredReading, 'temperature'),
          max: maxReading(filteredReading, 'temperature'),
          avg: avgReading(filteredReading, 'temperature'),
        };
        const humidity = {
          min: minReading(filteredReading, 'humidity'),
          max: maxReading(filteredReading, 'humidity'),
          avg: avgReading(filteredReading, 'humidity'),
        };
        const light = {
          low: totalHrReadings(filteredReading, 'luminance', 250, 2500),
          medium: totalHrReadings(filteredReading, 'luminance', 2500, 10000),
          bright: totalHrReadings(filteredReading, 'luminance', 10000, 20000),
          full: totalHrReadings(filteredReading, 'luminance', 20000, 100000),
          avg: avgReading(
            filteredReading.filter((i) => i.luminance > 0),
            'luminance'
          ),
          max: maxReading(
            filteredReading.filter((i) => i.luminance > 0),
            'luminance'
          ),
        };
        const air = {
          max: maxReading(
            filteredReading.filter((a) => a.iaqAccuracy === 3),
            'iaq'
          ),
          avg: avgReading(
            filteredReading.filter((a) => a.iaqAccuracy === 3),
            'iaq'
          ),
        };
        const data = filteredReading.reduce((acc, cur) => {
          const newAcc = acc;
          const hour = cur.timestamp.toDate().getHours();
          const hourData = acc[hour];
          newAcc[hour] = {
            total: (hourData?.total || 0) + 1,
            timestamp: cur.timestamp,
            temperature:
              ((hourData?.temperature || 0 * (hourData?.total || 1)) +
                cur.temperature) /
              ((hourData?.total || 0) + 1),
            humidity:
              ((hourData?.humidity || 0 * (hourData?.total || 1)) +
                cur.humidity) /
              ((hourData?.total || 0) + 1),
            iaq:
              ((hourData?.iaq || 0 * (hourData?.total || 1)) + cur.iaq) /
              ((hourData?.total || 0) + 1),
            eCO2:
              ((hourData?.eCO2 || 0 * (hourData?.total || 1)) + cur.eCO2) /
              ((hourData?.total || 0) + 1),
            eVOC:
              ((hourData?.eVOC || 0 * (hourData?.total || 1)) + cur.eVOC) /
              ((hourData?.total || 0) + 1),
            luminance:
              ((hourData?.luminance || 0 * (hourData?.total || 1)) +
                cur.luminance) /
              ((hourData?.total || 0) + 1),
          };
          return newAcc;
        }, {} as DailyReadingData);

        t.set(dReading, {
          timestamp,
          temperature,
          humidity,
          air,
          light,
          data,
        });
      });
      plant_ids.forEach((plant_id) => {
        const dReading = db
          .collection('mimirPlants')
          .doc(plant_id)
          .collection('Daily')
          .doc(admin.firestore.Timestamp.now().toDate().toDateString());
        const filteredReading = readings.filter((i) =>
          i.plants_ids.includes(plant_id)
        );

        const temperature = {
          min: minReading(filteredReading, 'temperature'),
          max: maxReading(filteredReading, 'temperature'),
          avg: avgReading(filteredReading, 'temperature'),
        };
        const humidity = {
          min: minReading(filteredReading, 'humidity'),
          max: maxReading(filteredReading, 'humidity'),
          avg: avgReading(filteredReading, 'humidity'),
        };
        const light = {
          low: totalHrReadings(filteredReading, 'luminance', 250, 2500),
          medium: totalHrReadings(filteredReading, 'luminance', 2500, 10000),
          bright: totalHrReadings(filteredReading, 'luminance', 10000, 20000),
          full: totalHrReadings(filteredReading, 'luminance', 20000, 100000),
          avg: avgReading(
            filteredReading.filter((i) => i.luminance > 0),
            'luminance'
          ),
          max: maxReading(
            filteredReading.filter((i) => i.luminance > 0),
            'luminance'
          ),
        };
        const air = {
          max: maxReading(
            filteredReading.filter((a) => a.iaqAccuracy === 3),
            'iaq'
          ),
          avg: avgReading(
            filteredReading.filter((a) => a.iaqAccuracy === 3),
            'iaq'
          ),
        };
        const data = filteredReading.reduce((acc, cur) => {
          const newAcc = acc;
          const hour = cur.timestamp.toDate().getHours();
          const hourData = acc[hour];
          newAcc[hour] = {
            total: (hourData?.total || 0) + 1,
            timestamp: cur.timestamp,
            temperature:
              ((hourData?.temperature || 0 * (hourData?.total || 1)) +
                cur.temperature) /
              ((hourData?.total || 0) + 1),
            humidity:
              ((hourData?.humidity || 0 * (hourData?.total || 1)) +
                cur.humidity) /
              ((hourData?.total || 0) + 1),
            iaq:
              ((hourData?.iaq || 0 * (hourData?.total || 1)) + cur.iaq) /
              ((hourData?.total || 0) + 1),
            eCO2:
              ((hourData?.eCO2 || 0 * (hourData?.total || 1)) + cur.eCO2) /
              ((hourData?.total || 0) + 1),
            eVOC:
              ((hourData?.eVOC || 0 * (hourData?.total || 1)) + cur.eVOC) /
              ((hourData?.total || 0) + 1),
            luminance:
              ((hourData?.luminance || 0 * (hourData?.total || 1)) +
                cur.luminance) /
              ((hourData?.total || 0) + 1),
          };
          return newAcc;
        }, {} as DailyReadingData);

        t.set(dReading, {
          timestamp,
          temperature,
          humidity,
          air,
          light,
          data,
        });
      });
    })
    .catch((err) => console.error(err));
});

type DailyReadingData = {
  [hour: number]: {
    total?: number;
    timestamp: FirebaseTimestamp;
    temperature?: number;
    humidity?: number;
    iaq?: number;
    eCO2?: number;
    eVOC?: number;
    luminance?: number;
  };
};
// const ScoreCalculator = functions.firestore
//   .document('mimirPlants/{plant_id}/Daily/{daily_id}')
//   .onCreate((daily, context) => {
//     const plant_id = context.params.plant_id;
//     return db
//       .runTransaction(async (t) => {
//         const plantDoc = (
//           await t.get(db.collection('mimiPlants').doc(plant_id))
//         ).data() as PlantProps;

//         const species_id = plantDoc.species.id;
//         const data = daily.data().data;

//         //Run function to generate score using [species_id] and [data]
//         //Return either score or error
//         const score = 0;

//         if (!score) throw `Error: ${score}`;

//         //if successful, update the daily document with the score
//         t.update(daily.ref, { score });
//       })
//       .catch((err) => console.error(err));
//   });
