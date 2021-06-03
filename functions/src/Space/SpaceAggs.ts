import { Log } from "@mimir/LogType";
import { SpaceAggProps } from "@mimir/SpaceType";
import * as functions from "firebase-functions";
import { initSpaceAgg } from "src/docs/space";
import { spaceRefs } from "src/util/firestoreUtil";
import { db, timestamp } from "..";
import {
    calcDeadTotal,
    calcFertilizerTotal,
    calcInspectionsTotal,
    calcPlantTotal,
    calcWateringsTotal
} from "../util/aggHelpers";
import { calcNewEnvironment } from "../util/dailyRecalc";

export const calcSpaceAgg = (
  doc: SpaceAggProps,
  log: Log,
  space_id: string
) => {
  const { content, type } = log;
  const newAgg: SpaceAggProps = {
    ...doc,
    timestamp,
    plant_total: calcPlantTotal(doc, type, content, space_id),
    dead_total: calcDeadTotal(doc, type),
    inspection_total: calcInspectionsTotal(doc, type),
    watering_total: calcWateringsTotal(doc, type),
    fertilizer_total: calcFertilizerTotal(doc, type, content),
    env: calcNewEnvironment(doc, type, content),
  };

  return newAgg;
};

export const spaceAggregation = functions.firestore
  .document("Spaces/{space_id}/logs/{log_id}")
  .onCreate((log, context) => {
    const space_id = context.params.space_id;

    const { spaceNewAggRef, spaceLatestAggRef } = spaceRefs(space_id);
    const space = db.collection("mimirSpaces").doc(space_id);

    return db
      .runTransaction(async (t) => {
        const latestAgg = await t.get(spaceLatestAggRef);
        const doc = !latestAgg.empty
          ? (latestAgg.docs[0].data() as SpaceAggProps)
          : initSpaceAgg(timestamp);
        t.set(spaceNewAggRef, calcSpaceAgg(doc, log.data() as Log, space_id));
      })
      .catch((error) => console.error(error));
  });
