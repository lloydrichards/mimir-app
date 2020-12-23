import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { initSpaceAgg, initSpaceConfig } from './docs/space';
import { FirebaseTimestamp, Log } from './types/GenericType';
import { SpaceAggProps } from './types/SpaceType';
import { reCalc } from './helpers';
import { once, setEventSuccess } from './util/once';

const timestamp = admin.firestore.FieldValue.serverTimestamp() as FirebaseTimestamp;
const increment = admin.firestore.FieldValue.increment;
const db = admin.firestore();
const stats = db.collection('Admin').doc('--spaces-stats--');

//Spaces
export const spaceCreated = functions.firestore
  .document('mimirSpaces/{space_id}')
  .onCreate(
    once(async (space, context) => {
      //device Added
      return db
        .runTransaction(async (t) => {
          const newSpace = db.collection('mimirSpaces').doc(space.id);
          const newAgg = newSpace.collection('Aggs').doc('--init--');
          const newConfig = newSpace.collection('Configs').doc('--init--');

          t.set(newAgg, initSpaceAgg(timestamp));
          t.set(newConfig, initSpaceConfig(timestamp));

          setEventSuccess(t, context).set(
            stats,
            {
              spaces_total: increment(1),
              room_type: {
                [space.data().room_type || 'undefined']: increment(1),
              },
              light_direction: {
                [space.data().light_direction || 'undefined']: increment(1),
              },
              region: {
                [space.data().location.region || 'undefined']: increment(1),
              },
              country: {
                [space.data().location.country || 'undefined']: increment(1),
              },
              city: {
                [space.data().location.city || 'undefined']: increment(1),
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
  .onUpdate((space, context) => {
    const spaceBefore = space.before.data();
    const spaceAfter = space.after.data();
    //const space_id = context.params.space_id;
    if (spaceBefore === spaceAfter) return;

    return db
      .runTransaction(async (t) => {
        t.set(
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
            light_direction: {
              [spaceBefore.light_direction || 'undefined']: increment(
                spaceBefore.light_direction === spaceAfter.light_direction ? 0 : -1
              ),
              [spaceAfter.light_direction || 'undefined']: increment(
                spaceBefore.light_direction === spaceAfter.light_direction ? 0 : 1
              ),
            },
            region: {
              [spaceBefore.location.region || 'undefined']: increment(
                spaceBefore.location.region === spaceAfter.location.region
                  ? 0
                  : -1
              ),
              [spaceAfter.location.region || 'undefined']: increment(
                spaceBefore.location.region === spaceAfter.location.region
                  ? 0
                  : 1
              ),
            },
            country: {
              [spaceBefore.location.country || 'undefined']: increment(
                spaceBefore.location.country === spaceAfter.location.country
                  ? 0
                  : -1
              ),
              [spaceAfter.location.country || 'undefined']: increment(
                spaceBefore.location.country === spaceAfter.location.country
                  ? 0
                  : 1
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
      })
      .catch((error) => console.error(error));
  });

export const spaceAggregation = functions.firestore
  .document('mimirSpaces/{space_id}/Logs/{log_id}')
  .onCreate((log, context) => {
    const space_id = context.params.space_id;
    const type = (log.data() as Log).type;
    const content = (log.data() as Log).content;
    const space = db.collection('mimirSpaces').doc(space_id);
    const newAgg = space.collection('Aggs').doc();
    const oldAgg = space
      .collection('Aggs')
      .orderBy('timestamp', 'desc')
      .limit(1);

    return db
      .runTransaction(async (t) => {
        const doc = (await t.get(oldAgg)).docs[0].data() as SpaceAggProps;
        t.set(newAgg, {
          ...doc,
          timestamp,
          reading_total: type.includes('DEVICE_UPDATE')
            ? doc.reading_total + (content.readings || 0)
            : doc.reading_total,
          plant_total:
            type.includes('PLANT_CREATED') ||
            type.includes('PLANT_CUTTING') ||
            (type.includes('PLANT_MOVED') && content.toSpace_id === space_id)
              ? doc.plant_total + 1
              : type.includes('PLANT_DIED') ||
                type.includes('PLANT_DELETED') ||
                (type.includes('PLANT_MOVED') &&
                  content.fromSpace_id === space_id)
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
          watering_last: type.includes('WATERING')
            ? timestamp
            : doc.watering_last,
          fertilizer_last:
            type.includes('WATERING') && content.fertilizer
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
              type.includes('DEVICE_UPDATE') &&
              content.humidity &&
              content.readings
                ? reCalc(
                    doc.humidity.min,
                    content.humidity.min,
                    doc.reading_total,
                    content.readings
                  )
                : doc.temperature.min,
            avg:
              type.includes('DEVICE_UPDATE') &&
              content.humidity &&
              content.readings
                ? reCalc(
                    doc.humidity.avg,
                    content.humidity.avg,
                    doc.reading_total,
                    content.readings
                  )
                : doc.humidity.avg,
            max:
              type.includes('DEVICE_UPDATE') &&
              content.humidity &&
              content.readings
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
              type.includes('DEVICE_UPDATE') &&
              content.light &&
              content.readings
                ? reCalc(
                    doc.light.shade,
                    content.light.shade,
                    doc.reading_total,
                    content.readings
                  )
                : doc.light.shade,
            half_shade:
              type.includes('DEVICE_UPDATE') &&
              content.light &&
              content.readings
                ? reCalc(
                    doc.light.half_shade,
                    content.light.half_shade,
                    doc.reading_total,
                    content.readings
                  )
                : doc.light.half_shade,
            full_sun:
              type.includes('DEVICE_UPDATE') &&
              content.light &&
              content.readings
                ? reCalc(
                    doc.light.full_sun,
                    content.light.full_sun,
                    doc.reading_total,
                    content.readings
                  )
                : doc.light.full_sun,
            avg:
              type.includes('DEVICE_UPDATE') &&
              content.light &&
              content.readings
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
        } as SpaceAggProps);
      })
      .catch((error) => console.error(error));
  });
