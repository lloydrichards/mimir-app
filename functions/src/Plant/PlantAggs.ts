import { Log } from "@mimir/LogType";
import { PlantAggProps } from "@mimir/PlantType";
import * as functions from "firebase-functions";
import {
  calcFertilizerTotal,
  calcInspectionsTotal,
  calcWateringsTotal,
} from "src/util/aggHelpers";
import { db, timestamp } from "..";
import { calcNewEnvironment } from "../util/dailyRecalc";

export const calcPlantAgg = (doc: PlantAggProps, log: Log) => {
  const { type, content } = log;
  const newAgg: PlantAggProps = {
    ...doc,
    timestamp,
    children_total: type.includes("PLANT_CUTTING")
      ? doc.children_total + 1
      : doc.children_total,
    happiness_total:
      type.includes("INSPECTION") && content.inspection?.happiness
        ? doc.happiness_total + content.inspection.happiness
        : doc.happiness_total,
    happiness_current:
      type.includes("INSPECTION") && content.inspection?.happiness
        ? content.inspection.happiness
        : doc.happiness_current,
    health_total:
      type.includes("INSPECTION") && content.inspection?.health
        ? doc.health_total + content.inspection.health
        : doc.health_total,
    health_current:
      type.includes("INSPECTION") && content.inspection?.health
        ? content.inspection.health
        : doc.health_current,
    inspection_total: calcInspectionsTotal(doc, type),
    watering_total: calcWateringsTotal(doc, type),
    fertilizer_total: calcFertilizerTotal(doc, type, content),
    env: calcNewEnvironment(doc, type, content),
  };

  return newAgg;
};

export const plantAggregation = functions.firestore
  .document("mimirPlants/{plant_id}/Logs/{log_id}")
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
