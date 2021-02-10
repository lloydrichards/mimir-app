import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { initUserAgg, initUserDoc, initUserSetting } from './docs/users';
import { FirebaseTimestamp, Log, Owner } from './types/GenericType';
import {
  UserAggProps,
  UserProps,
  UserSettingsProps,
  UserType,
} from './types/UserType';
import { once, setEventSuccess } from './util/once';

const timestamp = admin.firestore.FieldValue.serverTimestamp() as FirebaseTimestamp;
const increment = admin.firestore.FieldValue.increment;
const db = admin.firestore();
const stats = db.collection('Admin').doc('--users-stats--');

export const userCreated = functions.auth.user().onCreate(
  once(async (user, context) => {
    //New Auth User created
    const newUser = db.collection('mimirUsers').doc(user.uid);
    const newAgg = newUser.collection('Aggs').doc('--init--');
    const newLog = newUser.collection('Logs').doc();
    const newSetting = newUser.collection('_settings').doc('--settings--');
    return db
      .runTransaction(async (t) => {
        const initUserLog: Log = {
          timestamp,
          type: ['USER_CREATED'],
          content: {
            user_id: user.uid,
            user_email: user.email,
          },
        };

        t.set(newUser, initUserDoc(user.email || '', timestamp), {
          merge: true,
        });
        t.set(newAgg, initUserAgg(timestamp));
        t.set(newLog, initUserLog);
        t.set(newSetting, initUserSetting(timestamp));
        setEventSuccess(t, context).set(
          stats,
          {
            users_total: increment(1),
            gardener: {
              BEGINNER: increment(1),
            },
            last_added: timestamp,
          },
          { merge: true }
        );
      })
      .catch((error) => console.error(error));
  })
);

export const userUpdated = functions.firestore
  .document('mimirUsers/{user_id}')
  .onUpdate(
    once(async (user) => {
      const userBefore = user.before.data() as UserProps;
      const userAfter = user.after.data() as UserProps;
      const user_id = user.after.id;
      if (userBefore === userAfter) return;

      const batchArr: FirebaseFirestore.WriteBatch[] = [];
      batchArr.push(db.batch());
      let opCounter = 0;
      let batchIndex = 0;

      const ownerSnapArr: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[] = [];
      const creatorSnapArr: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[] = [];

      const oldOwner: Owner = {
        id: user_id,
        email: userBefore.social_media.email,
        name:
          userBefore.first_name && userBefore.last_name
            ? `${userBefore.first_name} ${userBefore.last_name}`
            : userBefore.last_name,
      };
      const updateOwner: Owner = {
        id: user_id,
        email: userAfter.social_media.email,
        name:
          userAfter.first_name && userAfter.last_name
            ? `${userAfter.first_name} ${userAfter.last_name}`
            : userAfter.last_name,
      };
      const oldUser: Partial<UserType> = {
        id: user_id,
        username: userBefore.username || '',
        gardener: userBefore.gardener || 'BEGINNER',
      };
      const updateUser: Partial<UserType> = {
        id: user_id,
        username: userAfter.username || '',
        gardener: userAfter.gardener || 'BEGINNER',
      };

      if (oldOwner !== updateOwner) {
        await db
          .collection('mimirPlants')
          .where('owner.id', '==', user_id)
          .get()
          .then((snap) => snap.docs.forEach((doc) => ownerSnapArr.push(doc)));

        await db
          .collection('mimirSpaces')
          .where('owner.id', '==', user_id)
          .get()
          .then((snap) => snap.docs.forEach((doc) => ownerSnapArr.push(doc)));

        await db
          .collection('mimirDevices')
          .where('owner.id', '==', user_id)
          .get()
          .then((snap) => snap.docs.forEach((doc) => ownerSnapArr.push(doc)));
      }

      if (oldUser !== updateUser) {
        await db
          .collection('mimirWaterings')
          .where('created_by.id', '==', user_id)
          .get()
          .then((snap) => snap.docs.forEach((doc) => ownerSnapArr.push(doc)));
        await db
          .collection('mimirInspections')
          .where('created_by.id', '==', user_id)
          .get()
          .then((snap) => snap.docs.forEach((doc) => ownerSnapArr.push(doc)));
      }

      ownerSnapArr.forEach((docSnap) => {
        batchArr[batchIndex].update(docSnap.ref, { owner: updateOwner });
        opCounter++;

        if (opCounter === 499) {
          batchArr.push(db.batch());
          batchIndex++;
          opCounter = 0;
        }
      });
      creatorSnapArr.forEach((docSnap) => {
        batchArr[batchIndex].update(docSnap.ref, { created_by: updateUser });
        opCounter++;

        if (opCounter === 499) {
          batchArr.push(db.batch());
          batchIndex++;
          opCounter = 0;
        }
      });

      batchArr[batchIndex].set(
        stats,
        {
          gardener: {
            [userBefore.gardener || 'UNDEFINED']: increment(
              userBefore.gardener === userAfter.gardener ? 0 : -1
            ),
            [userAfter.gardener || 'UNDEFINED']: increment(
              userBefore.gardener === userAfter.gardener ? 0 : 1
            ),
          },
          region: {
            [userBefore.location.region || 'UNDEFINED']: increment(
              userBefore.location.region === userAfter.location.region ? 0 : -1
            ),
            [userAfter.location.region || 'UNDEFINED']: increment(
              userBefore.location.region === userAfter.location.region ? 0 : 1
            ),
          },
          country: {
            [userBefore.location.country || 'UNDEFINED']: increment(
              userBefore.location.country === userAfter.location.country
                ? 0
                : -1
            ),
            [userAfter.location.country || 'UNDEFINED']: increment(
              userBefore.location.country === userAfter.location.country ? 0 : 1
            ),
          },
          city: {
            [userBefore.location.city || 'UNDEFINED']: increment(
              userBefore.location.city === userAfter.location.city ? 0 : -1
            ),
            [userAfter.location.city || 'UNDEFINED']: increment(
              userBefore.location.city === userAfter.location.city ? 0 : 1
            ),
          },
        },
        { merge: true }
      );
      return batchArr.forEach(async (batch) => await batch.commit());
    })
  );

export const userSettingsUpdate = functions.firestore
  .document('mimirUsers/{user_id}/_settings/{setting_id}')
  .onUpdate(async (setting) => {
    const userBefore = setting.before.data() as UserSettingsProps;
    const userAfter = setting.after.data() as UserSettingsProps;
    if (userBefore === userAfter) return;

    return db.runTransaction(async (t) => {
      if (userBefore.subscription !== userAfter.subscription) {
        t.set(
          stats,
          {
            timestamp,
            subscription: {
              [userBefore.subscription || 'UNDEFINED']: increment(
                userBefore.subscription === userAfter.subscription ? 0 : -1
              ),
              [userAfter.subscription || 'UNDEFINED']: increment(
                userBefore.subscription === userAfter.subscription ? 0 : 1
              ),
            },
          },
          { merge: true }
        );
      }
    });
  });

export const userAggregation = functions.firestore
  .document('mimirUsers/{user_id}/Logs/{log_id}')
  .onCreate((log, context) => {
    const user_id = context.params.user_id;
    const type = (log.data() as Log).type;
    const content = (log.data() as Log).content;
    const user = db.collection('mimirUsers').doc(user_id);
    const newAgg = user.collection('Aggs').doc();
    const oldAgg = user
      .collection('Aggs')
      .orderBy('timestamp', 'desc')
      .limit(1);

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
          dead_total: type.includes('PLANT_DIED')
            ? doc.dead_total + 1
            : doc.dead_total,
          points: type.includes('POINTS')
            ? doc.points + (content.points || 0)
            : doc.points,
          level: type.includes('POINTS')
            ? levelUp(doc.points + (content.points || 0))
            : doc.level,
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
