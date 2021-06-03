import { Log } from "@mimir/LogType";
import { UserAggProps } from "@mimir/UserType";
import * as functions from "firebase-functions";
import { db, timestamp } from "..";
import { initUserAgg } from "../docs/users";
import {
  calcSpaceTotal,
  calcPlantTotal,
  calcDeadTotal,
  calcPointTotal,
  calcLevel,
} from "../util/aggHelpers";
import { userRefs } from "../util/firestoreUtil";

export const calcUserAgg = (doc: UserAggProps, log: Log) => {
  const { type, content } = log;
  const newAgg: UserAggProps = {
    ...doc,
    timestamp,
    space_total: calcSpaceTotal(doc, type),
    plant_total: calcPlantTotal(doc, type, content),
    dead_total: calcDeadTotal(doc, type),
    points: calcPointTotal(doc, type, content),
    level: calcLevel(doc, type, content),
  };

  return newAgg;
};

export const userAggregation = functions
  .region("europe-west1")
  .firestore.document("Users/{user_id}/logs/{log_id}")
  .onCreate((log, context) => {
    const user_id = context.params.user_id;
    const { userNewAggRef, userLatestAggRef } = userRefs(user_id);

    return db
      .runTransaction(async (t) => {
        const currentAgg = await t.get(userLatestAggRef);
        const doc = currentAgg.empty
          ? initUserAgg(timestamp)
          : (currentAgg.docs[0].data() as UserAggProps);
        t.set(userNewAggRef, calcUserAgg(doc, log.data() as Log));
      })
      .catch((error) => console.error(error));
  });
