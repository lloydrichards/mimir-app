import { PlantProps, PlantType } from "@mimir/PlantType";
import { SpaceConfigProps } from "@mimir/SpaceType";
import * as functions from "firebase-functions";
import { AdminCollection, WateringsCollection } from "src/firestore";
import { db, timestamp, increment } from "..";

const stats = db.collection(AdminCollection).doc("--plants stats--");

export const plantUpdated = functions.firestore
  .document("mimirPlants/{plant_id}")
  .onUpdate(async (plant, context) => {
    const plantBefore = plant.before.data() as PlantProps;
    const plantAfter = plant.after.data() as PlantProps;
    const plant_id = context.params.plant_id;

    const batchArr: FirebaseFirestore.WriteBatch[] = [];
    batchArr.push(db.batch());
    let opCounter = 0;
    let batchIndex = 0;

    const docSnapArr: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[] =
      [];
    const plantsSnapArr: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[] =
      [];

    const oldPlant: PlantType = {
      botanical_name: plantBefore.species.id,
      type: plantBefore.species.type,
      id: plant_id,
      nickname: plantBefore.nickname,
    };
    const updatedPlant: PlantType = {
      botanical_name: plantAfter.species.id,
      type: plantAfter.species.type,
      id: plant_id,
      nickname: plantAfter.nickname,
    };

    if (oldPlant !== updatedPlant) {
      await db
        .collection(WateringsCollection)
        .where("plant_ids", "array-contains", plant_id)
        .get()
        .then((snap) => snap.docs.forEach((doc) => docSnapArr.push(doc)));
    }

    docSnapArr.forEach((docSnap) => {
      batchArr[batchIndex].update(docSnap.ref, { plant: updatedPlant });
      opCounter++;

      if (opCounter === 499) {
        batchArr.push(db.batch());
        batchIndex++;
        opCounter = 0;
      }
    });
    plantsSnapArr.forEach((docSnap) => {
      const doc = docSnap.data() as SpaceConfigProps;
      const updatedPlants = doc.plants.map((p) => {
        if (p.id === plant_id) {
          return updatedPlant;
        }
        return p;
      });
      batchArr[batchIndex].update(docSnap.ref, { plants: updatedPlants });
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
        last_added: timestamp,
        dead_total: increment(plantBefore.alive && !plantAfter.alive ? 1 : 0),
        alive_total: increment(plantBefore.alive && !plantAfter.alive ? -1 : 0),

        type: {
          [plantBefore.species.type || "UNDEFINED"]: increment(
            plantBefore.form === plantAfter.form ? 0 : -1
          ),
          [plantAfter.species.type || "UNDEFINED"]: increment(
            plantBefore.form === plantAfter.form ? 0 : 1
          ),
        },
        form: {
          [plantBefore.form || "UNDEFINED"]: increment(
            plantBefore.form === plantAfter.form ? 0 : -1
          ),
          [plantAfter.form || "UNDEFINED"]: increment(
            plantBefore.form === plantAfter.form ? 0 : 1
          ),
        },
        genus: {
          [plantBefore.species.genus || "UNDEFINED"]: increment(
            plantBefore.species.genus === plantAfter.species.genus ? 0 : -1
          ),
          [plantAfter.species.genus || "UNDEFINED"]: increment(
            plantBefore.species.genus === plantAfter.species.genus ? 0 : 1
          ),
        },
        species: {
          [plantBefore.species.species || "UNDEFINED"]: increment(
            plantBefore.species.species === plantAfter.species.species ? 0 : -1
          ),
          [plantAfter.species.species || "UNDEFINED"]: increment(
            plantBefore.species.species === plantAfter.species.species ? 0 : 1
          ),
        },
        family: {
          [plantBefore.species.family || "UNDEFINED"]: increment(
            plantBefore.species.family === plantAfter.species.family ? 0 : -1
          ),
          [plantAfter.species.family || "UNDEFINED"]: increment(
            plantBefore.species.family === plantAfter.species.family ? 0 : 1
          ),
        },
      },
      { merge: true }
    );
    return batchArr.forEach(async (batch) => await batch.commit());
  });
