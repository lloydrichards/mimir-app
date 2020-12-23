import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { initDeviceDoc, initDeviceAgg } from './docs/device';
import { FirebaseTimestamp, Log } from './types/GenericType';
import { DeviceAggProps } from './types/DeviceType';

const timestamp = admin.firestore.FieldValue.serverTimestamp() as FirebaseTimestamp;
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

export const deviceAggregation = functions.firestore
  .document('mimirDevices/{device_id}/Logs/{log_id}')
  .onCreate((log, context) => {
    const device_id = context.params.device_id;
    const type = (log.data() as Log).type;
    const content = (log.data() as Log).content;
    const device = db.collection('mimirDevices').doc(device_id);
    const newAgg = device.collection('Aggs').doc();
    const oldAgg = device.collection('Aggs').orderBy('timestamp', 'desc').limit(1);

    return db
      .runTransaction(async (t) => {
        const doc = (await t.get(oldAgg)).docs[0].data() as DeviceAggProps;
        t.set(newAgg, {
          ...doc,
          timestamp,
          space: type.includes('DEVICE_MOVED')
            ? { id: content.space_id, name: content.space_name, type: content.space_type }
            : doc.space,
          reading_total: type.includes('DEVICE_UPDATE')
            ? doc.reading_total + (content.readings || 0)
            : doc.reading_total,
          battery_percent:
            type.includes('DEVICE_UPDATE') && content.battery_percent
              ? content.battery_percent
              : doc.battery_percent,
          charge:
            type.includes('DEVICE_UPDATE') && content.battery_percent
              ? content.battery_percent < 30
              : doc.charge,
        } as DeviceAggProps);
      })
      .catch((error) => console.error(error));
  });
