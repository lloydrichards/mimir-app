import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { initSpaceAgg, initSpaceConfig } from './docs/space';


const timestamp = admin.firestore.FieldValue.serverTimestamp();
const increment = admin.firestore.FieldValue.increment;
const db = admin.firestore();

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
