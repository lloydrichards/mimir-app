import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { initUserAgg, initUserDoc } from './docs/users';
import { aggSwitch } from './helper/helper';
import { Log } from './types/GenericType';

const timestamp = admin.firestore.FieldValue.serverTimestamp();
const increment = admin.firestore.FieldValue.increment;
const db = admin.firestore();

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

export const userAggregation = functions.firestore
  .document('Users/{user_id}/Logs/{log_id}')
  .onCreate((log, context) => {
    const user_id = context.params.user_id;
    const logDoc: Log = log.data().type;
    const user = db.collection('Users').doc(user_id);
    const newAgg = user.collection('Aggs').doc();
    const oldAgg = user
      .collection('Aggs')
      .orderBy('timestamp', 'desc')
      .limit(1);

    return db
      .runTransaction(async (t) => {
        const doc = (await t.get(oldAgg)).docs[0].data();
        t.set(newAgg, {
          ...doc,
          timestamp,
          space_total: aggSwitch(doc.space_total, logDoc, user_id, 'SPACE'),
          plant_total: aggSwitch(doc.plant_total, logDoc, user_id, 'PLANT'),
          dead_total: aggSwitch(doc.dead_total, logDoc, user_id, 'DEAD'),
          points: increment(logDoc.content.points || 0),
        });
      })
      .catch((error) => console.error(error));
  });
