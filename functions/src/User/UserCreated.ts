import { Log } from "@mimir/LogType";
import * as functions from "firebase-functions";
import { initUserDoc, initUserSetting } from "../docs/users";
import {
  AdminCollection,
  UserLogsCollection,
  UsersCollection,
  UserSettingsCollection,
  UsersStats,
} from "../firestore";
import { db, increment, timestamp } from "../index";
import { once, setEventSuccess } from "../util/once";

const stats = db.collection(AdminCollection).doc(UsersStats);

export const userCreated = functions
  .region("europe-west1")
  .auth.user()
  .onCreate(
    once(async (user, context) => {
      //New Auth User created
      const userRef = db.collection(UsersCollection).doc(user.uid);
      const newLog = userRef.collection(UserLogsCollection).doc();
      const newSetting = userRef
        .collection(UserSettingsCollection)
        .doc("--settings--");
      return db
        .runTransaction(async (t) => {
          const initUserLog: Log = {
            timestamp,
            type: ["USER_CREATED"],
            content: {
              user: {
                id: user.uid,
                username: user.displayName || "",
              },
            },
          };

          t.set(
            userRef,
            initUserDoc(user.displayName || "", user.email || "", timestamp),
            {
              merge: true,
            }
          );
          t.set(newLog, initUserLog);
          t.set(newSetting, initUserSetting(timestamp));
          setEventSuccess(t, context).set(
            stats,
            {
              users_total: increment(1),
              users_level: { "1": increment(1) },
              date_format: { "dd/MM/yyyy": increment(1) },
              subscription: { FREE: increment(1) },
              unit_system: { UNITS_METRIC: increment(1) },
              last_added: timestamp,
            },
            { merge: true }
          );
        })
        .catch((error) => console.error(error));
    })
  );
