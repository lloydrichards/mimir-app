import { PlantProps } from "@mimir/PlantType";
import * as functions from "firebase-functions";
import { AdminCollection } from "../firestore";
import { db, increment, timestamp } from "..";

const stats = db.collection(AdminCollection).doc("--plants stats--");

export const plantCreated = functions
  .region("europe-west1")
  .firestore.document("mimirPlants/{plant_id}")
  .onCreate((plant) => {
    const plantDoc = plant.data() as PlantProps;
    return stats.set(
      {
        last_added: timestamp,
        plants_total: increment(1),
        alive_total: increment(1),
        type: {
          [plantDoc.species.type]: increment(1),
        },
        form: {
          [plantDoc.form]: increment(1),
        },
        family: {
          [plantDoc.species.family]: increment(1),
        },
        genus: {
          [plantDoc.species.genus]: increment(1),
        },
        species: {
          [plantDoc.species.id]: increment(1),
        },
      },
      { merge: true }
    );
  });
