import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { initUserAgg, initUserDoc } from './initDocs/users';
import { DataPackage } from './Model/sensor';
import { ConfigPlants } from './Model/space';
import { initDeviceAgg, initDeviceDoc } from './initDocs/device';
import { initSpaceAgg, initSpaceConfig } from './initDocs/space';
import { initPlantAggs } from './initDocs/plants';

admin.initializeApp();
const timestamp = admin.firestore.FieldValue.serverTimestamp();
const increment = admin.firestore.FieldValue.increment;

const db = admin.firestore();
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

//Users
export const userCreated = functions.auth.user().onCreate((user) => {
  //New Auth User created
  const batch = db.batch();

  const newUser = db.collection('mimirUsers').doc(user.uid);
  const newAgg = newUser.collection('Aggs').doc('--init--');
  const newLog = newUser.collection('Logs').doc();
  const stats = db.collection('Admin').doc('--users-stats--');

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
    if (user.before.id === '--stats--') return;
    const batch = db.batch();
    const userBefore = user.before.data();
    const userAfter = user.after.data();

    const stats = db.collection('Admin').doc('--users-stats--');
    batch.update(stats, {
      gardener: {
        [userBefore.gardener || 'undefined']: increment(
          userBefore.gardener === userAfter.gardener ? 0 : -1
        ),
        [userAfter.gardener || 'undefined']: increment(
          userBefore.gardener === userAfter.gardener ? 0 : 1
        ),
      },
      subscription: {
        [userBefore.subscription || 'undefined']: increment(
          userBefore.subscription === userAfter.subscription ? 0 : -1
        ),
        [userAfter.subscription || 'undefined']: increment(
          userBefore.subscription === userAfter.subscription ? 0 : 1
        ),
      },
      region: {
        [userBefore.location.region || 'undefined']: increment(
          userBefore.location.region === userAfter.location.region ? 0 : -1
        ),
        [userAfter.location.region || 'undefined']: increment(
          userBefore.location.region === userAfter.location.region ? 0 : 1
        ),
      },
      country: {
        [userBefore.location.country || 'undefined']: increment(
          userBefore.location.country === userAfter.location.country ? 0 : -1
        ),
        [userAfter.location.country || 'undefined']: increment(
          userBefore.location.country === userAfter.location.country ? 0 : 1
        ),
      },
      city: {
        [userBefore.location.city || 'undefined']: increment(
          userBefore.location.city === userAfter.location.city ? 0 : -1
        ),
        [userAfter.location.city || 'undefined']: increment(
          userBefore.location.city === userAfter.location.city ? 0 : 1
        ),
      },
    });
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
    const stats = db.collection('Admin').doc('--devices-stats--');

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
    const deviceBefore = device.before.data();
    const deviceAfter = device.after.data();

    const stats = db.collection('Admin').doc('--devices-stats--');
    batch.set(
      stats,
      {
        hardware: {
          [deviceBefore.hardware || 'undefined']: increment(
            deviceBefore.hardware === deviceAfter.hardware ? 0 : -1
          ),
          [deviceAfter.hardware || 'undefined']: increment(
            deviceBefore.hardware === deviceAfter.hardware ? 0 : 1
          ),
        },
        software: {
          [deviceBefore.software || 'undefined']: increment(
            deviceBefore.software === deviceAfter.software ? 0 : -1
          ),
          [deviceAfter.software || 'undefined']: increment(
            deviceBefore.software === deviceAfter.software ? 0 : -1
          ),
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
    const newConfig = newSpace.collection('Configs').doc('--init--');
    const stats = db.collection('Admin').doc('--spaces-stats--');

    batch.set(newAgg, initSpaceAgg(timestamp));
    batch.set(newConfig, initSpaceConfig(timestamp));

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
    const spaceBefore = space.before.data();
    const spaceAfter = space.after.data();

    const stats = db.collection('Admin').doc('--spaces-stats--');
    batch.set(
      stats,
      {
        last_added: timestamp,
        room_type: {
          [spaceBefore.room_type || 'undefined']: increment(
            spaceBefore.room_type === spaceAfter.room_type ? 0 : -1
          ),
          [spaceAfter.room_type || 'undefined']: increment(
            spaceBefore.room_type === spaceAfter.room_type ? 0 : 1
          ),
        },
        sun_exposure: {
          [spaceBefore.sun_exposure || 'undefined']: increment(
            spaceBefore.sun_exposure === spaceAfter.sun_exposure ? 0 : -1
          ),
          [spaceAfter.sun_exposure || 'undefined']: increment(
            spaceBefore.sun_exposure === spaceAfter.sun_exposure ? 0 : 1
          ),
        },
        region: {
          [spaceBefore.location.region || 'undefined']: increment(
            spaceBefore.location.region === spaceAfter.location.region ? 0 : -1
          ),
          [spaceAfter.location.region || 'undefined']: increment(
            spaceBefore.location.region === spaceAfter.location.region ? 0 : 1
          ),
        },
        country: {
          [spaceBefore.location.country || 'undefined']: increment(
            spaceBefore.location.country === spaceAfter.location.country
              ? 0
              : -1
          ),
          [spaceAfter.location.country || 'undefined']: increment(
            spaceBefore.location.country === spaceAfter.location.country ? 0 : 1
          ),
        },
        city: {
          [spaceBefore.location.city || 'undefined']: increment(
            spaceBefore.location.city === spaceAfter.location.city ? 0 : -1
          ),
          [spaceAfter.location.city || 'undefined']: increment(
            spaceBefore.location.city === spaceAfter.location.city ? 0 : 1
          ),
        },
      },
      { merge: true }
    );
    return batch.commit();
  });

//Plants
export const plantCreated = functions.firestore
  .document('mimirPlants/{plant_id}')
  .onCreate((plant) => {
    const batch = db.batch();

    const newPlant = db.collection('mimirPlants').doc(plant.id);
    const newAgg = newPlant.collection('Aggs').doc('--init--');
    const stats = db.collection('Admin').doc('--plants-stats--');

    batch.set(newAgg, initPlantAggs(timestamp));
    batch.set(
      stats,
      {
        last_added: timestamp,
        plants_total: increment(1),
        alive_total: increment(1),
        form: {
          [plant.data().form]: increment(1),
        },
        family: {
          [plant.data().species.family]: increment(1),
        },
        genus: {
          [plant.data().species.genus]: increment(1),
        },
        species: {
          [plant.data().species.id]: increment(1),
        },
        size: {
          [plant.data().pot.size]: increment(1),
        },
      },
      { merge: true }
    );

    return batch.commit();
  });

export const plantUpdated = functions.firestore
  .document('mimirPlants/{plant_id}')
  .onUpdate((plant) => {
    const batch = db.batch();
    const plantBefore = plant.before.data();
    const plantAfter = plant.after.data();

    const stats = db.collection('Admin').doc('--plants-stats--');
    batch.set(
      stats,
      {
        last_added: timestamp,
        dead_total: increment(plantBefore.alive && !plantAfter.alive ? 1 : 0),
        alive_total: increment(plantBefore.alive && !plantAfter.alive ? -1 : 0),
        form: {
          [plantBefore.form || 'undefined']: increment(
            plantBefore.form === plantAfter.form ? 0 : -1
          ),
          [plantAfter.form || 'undefined']: increment(
            plantBefore.form === plantAfter.form ? 0 : 1
          ),
        },
        size: {
          [plantBefore.size || 'undefined']: increment(
            plantBefore.size === plantAfter.family ? 0 : -1
          ),
          [plantAfter.size || 'undefined']: increment(
            plantBefore.size === plantAfter.size ? 0 : 1
          ),
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
