import { Log } from "@mimir/LogType";
import { PlantAggProps } from "@mimir/PlantType";
import * as functions from "firebase-functions";
import {
  calcChildrenTotal,
  calcFertilizerTotal,
  calcHappinessTotal,
  calcHealthTotal,
  calcInspectionsTotal,
  calcWateringsTotal,
} from "../util/aggHelpers";
import { db, timestamp } from "..";
import { calcNewEnvironment } from "../util/dailyRecalc";

const calcPlantAgg = (doc: PlantAggProps, log: Log) => {
  const { type, content } = log;
  const newAgg: PlantAggProps = {
    ...doc,
    timestamp,
    children_total: calcChildrenTotal(doc, type),
    happiness_total: calcHappinessTotal(doc, type, content),
    health_total: calcHealthTotal(doc, type, content),
    inspection_total: calcInspectionsTotal(doc, type),
    watering_total: calcWateringsTotal(doc, type),
    fertilizer_total: calcFertilizerTotal(doc, type, content),
    env: calcNewEnvironment(doc, type, content),
  };

  return newAgg;
};

export const plantAggregation = functions
  .region("europe-west1")
  .firestore.document("mimirPlants/{plant_id}/Logs/{log_id}")
  .onCreate((log, context) => {
    const plant_id = context.params.plant_id;
    const plant = db.collection("mimirPlants").doc(plant_id);
    const newAgg = plant.collection("Aggs").doc();
    const oldAgg = plant
      .collection("Aggs")
      .orderBy("timestamp", "desc")
      .limit(1);

    return db
      .runTransaction(async (t) => {
        const doc = (await t.get(oldAgg)).docs[0].data() as PlantAggProps;

        t.set(newAgg, calcPlantAgg(doc, log.data() as Log));
      })
      .catch((error) => console.error(error));
  });
