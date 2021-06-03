import { Log } from "@mimir/LogType";
import { SpaceAggProps } from "@mimir/SpaceType";
import * as functions from "firebase-functions";
import { db, timestamp } from "..";
import { reCalc } from "../helpers";
import {
  calcDeadTotal,
  calcFertilizerTotal,
  calcInspectionsTotal,
  calcPlantTotal,
  calcWateringsTotal,
} from "../util/aggHelpers";

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
    env: {
      reading_total: type.includes("DEVICE_UPDATE")
        ? doc.env.reading_total + (content.readings || 0)
        : doc.env.reading_total,
      temperature: {
        min:
          type.includes("DEVICE_UPDATE") &&
          content.temperature &&
          content.readings
            ? reCalc(
                doc.env.temperature.min,
                content.temperature.min,
                doc.env.reading_total,
                content.readings
              )
            : doc.env.temperature.min,
        avg:
          type.includes("DEVICE_UPDATE") &&
          content.temperature &&
          content.readings
            ? reCalc(
                doc.env.temperature.avg,
                content.temperature.avg,
                doc.env.reading_total,
                content.readings
              )
            : doc.env.temperature.avg,
        max:
          type.includes("DEVICE_UPDATE") &&
          content.temperature &&
          content.readings
            ? reCalc(
                doc.env.temperature.max,
                content.temperature.max,
                doc.env.reading_total,
                content.readings
              )
            : doc.env.temperature.max,
      },

      humidity: {
        min:
          type.includes("DEVICE_UPDATE") && content.humidity && content.readings
            ? reCalc(
                doc.env.humidity.min,
                content.humidity.min,
                doc.env.reading_total,
                content.readings
              )
            : doc.env.temperature.min,
        avg:
          type.includes("DEVICE_UPDATE") && content.humidity && content.readings
            ? reCalc(
                doc.env.humidity.avg,
                content.humidity.avg,
                doc.env.reading_total,
                content.readings
              )
            : doc.env.humidity.avg,
        max:
          type.includes("DEVICE_UPDATE") && content.humidity && content.readings
            ? reCalc(
                doc.env.humidity.max,
                content.humidity.max,
                doc.env.reading_total,
                content.readings
              )
            : doc.env.temperature.max,
      },

      light: {
        shade:
          type.includes("DEVICE_UPDATE") && content.light && content.readings
            ? reCalc(
                doc.env.light.shade,
                content.light.shade,
                doc.env.reading_total,
                content.readings
              )
            : doc.env.light.shade,
        half_shade:
          type.includes("DEVICE_UPDATE") && content.light && content.readings
            ? reCalc(
                doc.env.light.half_shade,
                content.light.half_shade,
                doc.env.reading_total,
                content.readings
              )
            : doc.env.light.half_shade,
        full_sun:
          type.includes("DEVICE_UPDATE") && content.light && content.readings
            ? reCalc(
                doc.env.light.full_sun,
                content.light.full_sun,
                doc.env.reading_total,
                content.readings
              )
            : doc.env.light.full_sun,
        avg:
          type.includes("DEVICE_UPDATE") && content.light && content.readings
            ? reCalc(
                doc.env.light.avg,
                content.light.avg,
                doc.env.reading_total,
                content.readings
              )
            : doc.env.light.avg,
        max:
          type.includes("DEVICE_UPDATE") &&
          content.light &&
          content.readings &&
          content.light.max > doc.env.light.max
            ? content.light.max
            : doc.env.light.avg,
      },
    },
  };

  return newAgg;
};

export const spaceAggregation = functions.firestore
  .document("mimirSpaces/{space_id}/Logs/{log_id}")
  .onCreate((log, context) => {
    const space_id = context.params.space_id;
    const space = db.collection("mimirSpaces").doc(space_id);
    const newAgg = space.collection("Aggs").doc();
    const oldAgg = space
      .collection("Aggs")
      .orderBy("timestamp", "desc")
      .limit(1);

    return db
      .runTransaction(async (t) => {
        const doc = (await t.get(oldAgg)).docs[0].data() as SpaceAggProps;
        t.set(newAgg, calcSpaceAgg(doc, log.data() as Log, space_id));
      })
      .catch((error) => console.error(error));
  });
