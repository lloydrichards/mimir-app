import { Owner } from "@mimir/GenericType";
import { UserProps, UserSettingsProps, UserType } from "@mimir/UserType";
import * as functions from "firebase-functions";
import { db, increment, timestamp } from "..";
import {
  AdminCollection,
  DevicesCollection,
  PlantsCollection,
  SpacesCollection,
  UsersStats,
  WateringsCollection,
} from "../firestore";
import { once } from "../util/once";

const stats = db.collection(AdminCollection).doc(UsersStats);

export const userUpdated = functions
  .region("europe-west1")
  .firestore.document("mimirUsers/{user_id}")
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

      const ownerSnapArr: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[] =
        [];
      const creatorSnapArr: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[] =
        [];

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
        username: userBefore.username || "",
      };
      const updateUser: Partial<UserType> = {
        id: user_id,
        username: userAfter.username || "",
      };

      if (oldOwner !== updateOwner) {
        await db
          .collection(PlantsCollection)
          .where("owner.id", "==", user_id)
          .get()
          .then((snap) => snap.docs.forEach((doc) => ownerSnapArr.push(doc)));

        await db
          .collection(SpacesCollection)
          .where("owner.id", "==", user_id)
          .get()
          .then((snap) => snap.docs.forEach((doc) => ownerSnapArr.push(doc)));

        await db
          .collection(DevicesCollection)
          .where("owner.id", "==", user_id)
          .get()
          .then((snap) => snap.docs.forEach((doc) => ownerSnapArr.push(doc)));
      }

      if (oldUser !== updateUser) {
        await db
          .collection(WateringsCollection)
          .where("created_by.id", "==", user_id)
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
          region: {
            [userBefore.location.region || "UNDEFINED"]: increment(
              userBefore.location.region === userAfter.location.region ? 0 : -1
            ),
            [userAfter.location.region || "UNDEFINED"]: increment(
              userBefore.location.region === userAfter.location.region ? 0 : 1
            ),
          },
          country: {
            [userBefore.location.country || "UNDEFINED"]: increment(
              userBefore.location.country === userAfter.location.country
                ? 0
                : -1
            ),
            [userAfter.location.country || "UNDEFINED"]: increment(
              userBefore.location.country === userAfter.location.country ? 0 : 1
            ),
          },
          city: {
            [userBefore.location.city || "UNDEFINED"]: increment(
              userBefore.location.city === userAfter.location.city ? 0 : -1
            ),
            [userAfter.location.city || "UNDEFINED"]: increment(
              userBefore.location.city === userAfter.location.city ? 0 : 1
            ),
          },
        },
        { merge: true }
      );
      return batchArr.forEach(async (batch) => await batch.commit());
    })
  );

export const userSettingsUpdated = functions
  .region("europe-west1")
  .firestore.document("Users/{user_id}/_settings/{settings_id}")
  .onUpdate((user) => {
    const userBefore = user.before.data() as UserSettingsProps;
    const userAfter = user.after.data() as UserSettingsProps;
    if (userBefore === userAfter) return Promise.resolve();

    return db.runTransaction(async (t) => {
      if (userBefore.subscription !== userAfter.subscription) {
        t.set(
          stats,
          {
            timestamp,
            subscription: {
              [userBefore.subscription.type || "UNDEFINED"]: increment(
                userBefore.subscription.type === userAfter.subscription.type
                  ? 0
                  : -1
              ),
              [userAfter.subscription.type || "UNDEFINED"]: increment(
                userBefore.subscription.type === userAfter.subscription.type
                  ? 0
                  : 1
              ),
            },
            unit_system: {
              [userBefore.unit_system || "UNDEFINED"]: increment(
                userBefore.unit_system === userAfter.unit_system ? 0 : -1
              ),
              [userAfter.unit_system || "UNDEFINED"]: increment(
                userBefore.unit_system === userAfter.unit_system ? 0 : 1
              ),
            },
            date_format: {
              [userBefore.date_format || "UNDEFINED"]: increment(
                userBefore.date_format === userAfter.date_format ? 0 : -1
              ),
              [userAfter.date_format || "UNDEFINED"]: increment(
                userBefore.date_format === userAfter.date_format ? 0 : 1
              ),
            },
          },
          { merge: true }
        );
      }
    });
  });
