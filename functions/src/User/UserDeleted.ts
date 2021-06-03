import {
  UserAggProps,
  UserProps,
  UserSettingsProps,
  UserStatsProps,
} from "@mimir/UserType";
import * as functions from "firebase-functions";
import {
  AdminCollection,
  PlantsCollection,
  SpacesCollection,
  UsersCollection,
  UsersStats,
} from "../firestore";
import { userRefs } from "../util/firestoreUtil";
const firestore_tools = require("firebase-tools");
import { db, timestamp, increment } from "..";

const stats = db.collection(AdminCollection).doc(UsersStats);

export const userDeleted = functions
  .region("europe-west1")
  .auth.user()
  .onDelete(async (user) => {
    const user_id = user.uid;
    const project = process.env.GCLOUD_PROJECT;
    const token = functions.config().ci_token;
    const path = `/Users/${user_id}`;

    const {
      userLatestAggRef,
      userSettingsRef,
      userAllPlantsRef,
      userAllSpacesRef,
    } = userRefs(user_id);
    const userAggs = await userLatestAggRef.get();
    const latestAgg = !userAggs.empty
      ? (userAggs.docs[0].data() as UserAggProps)
      : undefined;
    const settings = (await userSettingsRef.get()).data() as UserSettingsProps;

    const spaces = await userAllSpacesRef.get();
    const plants = await userAllPlantsRef.get();

    await Promise.all(
      [...spaces.docs, ...plants.docs].map((doc) => {
        const roles = doc.data().roles;
        delete roles[user_id];

        return doc.ref.update({ roles });
      })
    );
    const newStats: Partial<UserStatsProps> = {
      timestamp,
      users_total: increment(-1),
      subscription: {
        [settings.subscription.type]: increment(-1),
      },
      date_format: {
        [settings.date_format]: increment(-1),
      },
      unit_system: {
        [settings.unit_system]: increment(-1),
      },
    };

    if (latestAgg) {
      newStats.users_level = { [latestAgg.level]: increment(-1) };
    }
    await stats.set(newStats, { merge: true });

    return firestore_tools.firestore.delete(path, {
      project,
      token,
      recursive: true,
      yes: true,
    });
  });
