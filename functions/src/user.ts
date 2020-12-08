import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { initUserAgg, initUserDoc } from './docs/users';
import { Log } from './types/GenericType';
import { UserAggProps } from './types/UserType';

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

export const userUpdated = functions.firestore.document('mimirUsers/{user_id}').onUpdate((user) => {
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
  .document('mimirUsers/{user_id}/Logs/{log_id}')
  .onCreate((log, context) => {
    const user_id = context.params.user_id;
    const type = (log.data() as Log).type;
    const content = (log.data() as Log).content;
    const user = db.collection('mimirUsers').doc(user_id);
    const newAgg = user.collection('Aggs').doc();
    const oldAgg = user.collection('Aggs').orderBy('timestamp', 'desc').limit(1);

    return db
      .runTransaction(async (t) => {
        const doc = (await t.get(oldAgg)).docs[0].data() as UserAggProps;
        t.set(newAgg, {
          ...doc,
          timestamp,
          space_total: type.includes('SPACE_CREATED')
            ? doc.space_total + 1
            : type.includes('SPACE_DELETED')
            ? doc.space_total - 1
            : doc.space_total,
          plant_total:
            type.includes('PLANT_CREATED') || type.includes('PLANT_CUTTING')
              ? doc.plant_total + 1
              : type.includes('PLANT_DIED') || type.includes('PLANT_DELETED')
              ? doc.plant_total - 1
              : doc.plant_total,
          dead_total: type.includes('PLANT_DIED') ? doc.dead_total + 1 : doc.dead_total,
          points: type.includes('POINTS') ? doc.points + (content.points || 0) : doc.points,
          level: type.includes('POINTS') ? levelUp(doc.points + (content.points || 0)) : doc.level,
        } as UserAggProps);
      })
      .catch((error) => console.error(error));
  });

const levelUp = (points: number): number => {
  return points <= 10
    ? 1
    : points <= 25
    ? 2
    : points <= 50
    ? 3
    : points <= 100
    ? 4
    : points <= 250
    ? 5
    : points <= 500
    ? 6
    : points <= 1000
    ? 7
    : points <= 2500
    ? 8
    : points <= 10000
    ? 9
    : 10;
};
