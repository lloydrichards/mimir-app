import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { initDeviceDoc, initDeviceAgg } from './docs/device';

const timestamp = admin.firestore.FieldValue.serverTimestamp();
const increment = admin.firestore.FieldValue.increment;
const db = admin.firestore();

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
