@@ -1,353 +0,0 @@
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { initSpaceAgg, initSpaceConfig } from './docs/space';
import { FirebaseTimestamp } from '../../types/GenericType';
import { SpaceAggProps, SpaceProps, SpaceType } from '../../types/SpaceType';
import { reCalc } from './helpers';
import { once, setEventSuccess } from './util/once';
import { Log } from '../../types/LogType';

const timestamp = admin.firestore.FieldValue.serverTimestamp() as FirebaseTimestamp;
const increment = admin.firestore.FieldValue.increment;
const db = admin.firestore();
const stats = db.collection('Admin').doc('--spaces-stats--');

export const calcSpaceAgg = (
  doc: SpaceAggProps,
  log: Log,
  space_id: string
) => {
  const { content, type } = log;
  const newAgg: SpaceAggProps = {
    ...doc,
    timestamp,
    reading_total: type.includes('DEVICE_UPDATE')
      ? doc.reading_total + (content.readings || 0)
      : doc.reading_total,
    plant_total:
      type.includes('PLANT_CREATED') ||
      type.includes('PLANT_CUTTING') ||
      (type.includes('PLANT_MOVED') && content.toSpace?.id === space_id)
        ? doc.plant_total + 1
        : type.includes('PLANT_DIED') ||
          type.includes('PLANT_DELETED') ||
          (type.includes('PLANT_MOVED') && content.fromSpace?.id === space_id)
        ? doc.plant_total - 1
        : doc.plant_total,
    dead_total: type.includes('PLANT_DIED') ? 1 : 0,
    inspection_total: type.includes('INSPECTION')
      ? doc.inspection_total + 1
      : doc.inspection_total,
    inspection_last: type.includes('INSPECTION')
      ? timestamp
      : doc.inspection_last,
    watering_total: type.includes('WATERING')
      ? doc.watering_total + 1
      : doc.watering_total,
    watering_last: type.includes('WATERING') ? timestamp : doc.watering_last,
    fertilizer_last:
      type.includes('WATERING') && content.water?.fertilizer
        ? timestamp
        : doc.fertilizer_last,
    temperature: {
      min:
        type.includes('DEVICE_UPDATE') &&
        content.temperature &&
        content.readings
          ? reCalc(
              doc.temperature.min,
              content.temperature.min,
              doc.reading_total,
              content.readings
            )
          : doc.temperature.min,
      avg:
        type.includes('DEVICE_UPDATE') &&
        content.temperature &&
        content.readings
          ? reCalc(
              doc.temperature.avg,
              content.temperature.avg,
              doc.reading_total,
              content.readings
            )
          : doc.temperature.avg,
      max:
        type.includes('DEVICE_UPDATE') &&
        content.temperature &&
        content.readings
          ? reCalc(
              doc.temperature.max,
              content.temperature.max,
              doc.reading_total,
              content.readings
            )
          : doc.temperature.max,
    },
    humidity: {
      min:
        type.includes('DEVICE_UPDATE') && content.humidity && content.readings
          ? reCalc(
              doc.humidity.min,
              content.humidity.min,
              doc.reading_total,
              content.readings
            )
          : doc.temperature.min,
      avg:
        type.includes('DEVICE_UPDATE') && content.humidity && content.readings
          ? reCalc(
              doc.humidity.avg,
              content.humidity.avg,
              doc.reading_total,
              content.readings
            )
          : doc.humidity.avg,
      max:
        type.includes('DEVICE_UPDATE') && content.humidity && content.readings
          ? reCalc(
              doc.humidity.max,
              content.humidity.max,
              doc.reading_total,
              content.readings
            )
          : doc.temperature.max,
    },
    light: {
      shade:
        type.includes('DEVICE_UPDATE') && content.light && content.readings
          ? reCalc(
              doc.light.shade,
              content.light.shade,
              doc.reading_total,
              content.readings
            )
          : doc.light.shade,
      half_shade:
        type.includes('DEVICE_UPDATE') && content.light && content.readings
          ? reCalc(
              doc.light.half_shade,
              content.light.half_shade,
              doc.reading_total,
              content.readings
            )
          : doc.light.half_shade,
      full_sun:
        type.includes('DEVICE_UPDATE') && content.light && content.readings
          ? reCalc(
              doc.light.full_sun,
              content.light.full_sun,
              doc.reading_total,
              content.readings
            )
          : doc.light.full_sun,
      avg:
        type.includes('DEVICE_UPDATE') && content.light && content.readings
          ? reCalc(
              doc.light.avg,
              content.light.avg,
              doc.reading_total,
              content.readings
            )
          : doc.light.avg,
      max:
        type.includes('DEVICE_UPDATE') &&
        content.light &&
        content.readings &&
        content.light.max > doc.light.max
          ? content.light.max
          : doc.light.avg,
    },
  };

  return newAgg;
};
//Spaces
export const spaceCreated = functions.firestore
  .document('mimirSpaces/{space_id}')
  .onCreate(
    once(async (space, context) => {
      //device Added
      return db
        .runTransaction(async (t) => {
          const newAgg = space.ref.collection('Aggs').doc('--init--');
          const newConfig = space.ref.collection('Configs').doc('--init--');

          const spaceDoc = (await space.data()) as SpaceProps;
          t.set(newAgg, initSpaceAgg(timestamp));
          t.set(newConfig, initSpaceConfig(timestamp));

          const light_direction = {};
          spaceDoc.light_direction.forEach((dir) => {
            return { [dir]: increment(1) };
          });
          setEventSuccess(t, context).set(
            stats,
            {
              spaces_total: increment(1),
              room_type: {
                [space.data().room_type || 'UNDEFINED']: increment(1),
              },
              light_direction,
              region: {
                [space.data().location.region || 'UNDEFINED']: increment(1),
              },
              country: {
                [space.data().location.country || 'UNDEFINED']: increment(1),
              },
              city: {
                [space.data().location.city || 'UNDEFINED']: increment(1),
              },
              last_added: timestamp,
            },
            { merge: true }
          );
        })
        .catch((error) => console.error(error));
    })
  );

export const spaceUpdated = functions.firestore
  .document('mimirSpaces/{space_id}')
  .onUpdate(async (space, context) => {
    const spaceBefore = space.before.data() as SpaceProps;
    const spaceAfter = space.after.data() as SpaceProps;
    const space_id = context.params.space_id;
    if (spaceBefore === spaceAfter) return;

    const batchArr: FirebaseFirestore.WriteBatch[] = [];
    batchArr.push(db.batch());
    let opCounter = 0;
    let batchIndex = 0;

    const docSnapArr: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[] = [];

    const oldSpace: SpaceType = {
      id: space_id,
      name: spaceBefore.name,
      light_direction: spaceBefore.light_direction,
      room_type: spaceBefore.room_type,
      thumb: spaceBefore.picture?.thumb || '',
    };
    const updateSpace: SpaceType = {
      id: space_id,
      name: spaceAfter.name,
      light_direction: spaceAfter.light_direction,
      room_type: spaceAfter.room_type,
      thumb: spaceAfter.picture?.thumb || '',
    };

    if (oldSpace !== updateSpace) {
      await db
        .collection('mimirWaterings')
        .where('space.id', '==', space_id)
        .get()
        .then((snap) => snap.docs.forEach((doc) => docSnapArr.push(doc)));
      await db
        .collection('mimirInspections')
        .where('space.id', '==', space_id)
        .get()
        .then((snap) => snap.docs.forEach((doc) => docSnapArr.push(doc)));
    }

    docSnapArr.forEach((docSnap) => {
      batchArr[batchIndex].update(docSnap.ref, { space: updateSpace });
      opCounter++;

      if (opCounter === 499) {
        batchArr.push(db.batch());
        batchIndex++;
        opCounter = 0;
      }
    });

    const bothDirections = [
      ...new Set([
        ...spaceBefore.light_direction,
        ...spaceAfter.light_direction,
      ]),
    ];
    const light_direction: any = {};
    bothDirections.forEach((dir) => {
      if (
        spaceBefore.light_direction.includes(dir) &&
        !spaceAfter.light_direction.includes(dir)
      ) {
        light_direction[dir] = increment(-1);
      } else if (
        !spaceBefore.light_direction.includes(dir) &&
        spaceAfter.light_direction.includes(dir)
      ) {
        light_direction[dir] = increment(-1);
      } else if (
        spaceBefore.light_direction.includes(dir) &&
        spaceAfter.light_direction.includes(dir)
      ) {
        light_direction[dir] = increment(0);
      }
    });

    batchArr[batchIndex].set(
      stats,
      {
        last_added: timestamp,
        room_type: {
          [spaceBefore.room_type || 'UNDEFINED']: increment(
            spaceBefore.room_type === spaceAfter.room_type ? 0 : -1
          ),
          [spaceAfter.room_type || 'UNDEFINED']: increment(
            spaceBefore.room_type === spaceAfter.room_type ? 0 : 1
          ),
        },
        light_direction,
        region: {
          [spaceBefore.location.region || 'UNDEFINED']: increment(
            spaceBefore.location.region === spaceAfter.location.region ? 0 : -1
          ),
          [spaceAfter.location.region || 'UNDEFINED']: increment(
            spaceBefore.location.region === spaceAfter.location.region ? 0 : 1
          ),
        },
        country: {
          [spaceBefore.location.country || 'UNDEFINED']: increment(
            spaceBefore.location.country === spaceAfter.location.country
              ? 0
              : -1
          ),
          [spaceAfter.location.country || 'UNDEFINED']: increment(
            spaceBefore.location.country === spaceAfter.location.country ? 0 : 1
          ),
        },
        city: {
          [spaceBefore.location.city || 'UNDEFINED']: increment(
            spaceBefore.location.city === spaceAfter.location.city ? 0 : -1
          ),
          [spaceAfter.location.city || 'UNDEFINED']: increment(
            spaceBefore.location.city === spaceAfter.location.city ? 0 : 1
          ),
        },
      },
      { merge: true }
    );

    return batchArr.forEach(async (batch) => await batch.commit());
  });

export const spaceAggregation = functions.firestore
  .document('mimirSpaces/{space_id}/Logs/{log_id}')
  .onCreate((log, context) => {
    const space_id = context.params.space_id;
    const space = db.collection('mimirSpaces').doc(space_id);
    const newAgg = space.collection('Aggs').doc();
    const oldAgg = space
      .collection('Aggs')
      .orderBy('timestamp', 'desc')
      .limit(1);

    return db
      .runTransaction(async (t) => {
        const doc = (await t.get(oldAgg)).docs[0].data() as SpaceAggProps;
        t.set(newAgg, calcSpaceAgg(doc, log.data() as Log, space_id));
      })
      .catch((error) => console.error(error));
  });