import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { initPlantAggs } from './docs/plants';
import { FirebaseTimestamp } from '../../types/GenericType';
import { PlantAggProps, PlantProps, PlantType } from '../../types/PlantType';
import { reCalc } from './helpers';
import { SpaceConfigProps } from '../../types/SpaceType';
import { Log } from '../../types/LogType';

const timestamp = admin.firestore.FieldValue.serverTimestamp() as FirebaseTimestamp;
const increment = admin.firestore.FieldValue.increment;
const db = admin.firestore();

const stats = db.collection('Admin').doc('--plants-stats--');

export const calcPlantAgg = (doc: PlantAggProps, log: Log) => {
  const { type, content } = log;
  const newAgg: PlantAggProps = {
    ...doc,
    timestamp,
    space:
      type.includes('PLANT_MOVED') && content.space ? content.space : doc.space,
    children_total: type.includes('PLANT_CUTTING')
      ? doc.children_total + 1
      : doc.children_total,
    happiness_total:
      type.includes('INSPECTION') && content.inspection?.happiness
        ? doc.happiness_total + content.inspection.happiness
        : doc.happiness_total,
    happiness_current:
      type.includes('INSPECTION') && content.inspection?.happiness
        ? content.inspection.happiness
        : doc.happiness_current,
    health_total:
      type.includes('INSPECTION') && content.inspection?.health
        ? doc.health_total + content.inspection.health
        : doc.health_total,
    health_current:
      type.includes('INSPECTION') && content.inspection?.health
        ? content.inspection.health
        : doc.health_current,
    reading_total: type.includes('DEVICE_UPDATE')
      ? doc.reading_total + (content.readings || 0)
      : doc.reading_total,
    inspection_total: type.includes('INSPECTION')
      ? doc.inspection_total + 1
      : doc.inspection_total,
    inspection_last: type.includes('INSPECTION')
      ? timestamp
      : doc.inspection_last,
    watering_total: type.includes('WATERING')
      ? doc.watering_total + 1
      : doc.watering_total,
    watering_last: type.includes('WATERING') ? timestamp : doc.watering_last,
    fertilizer_last:
      type.includes('WATERING') && content.water?.fertilizer
        ? timestamp
        : doc.watering_last,
    temperature: {
      min:
        type.includes('DEVICE_UPDATE') &&
        content.temperature &&
        content.readings
          ? reCalc(
              doc.temperature.min,
              content.temperature.min,
              doc.reading_total,
              content.readings
            )
          : doc.temperature.min,
      avg:
        type.includes('DEVICE_UPDATE') &&
        content.temperature &&
        content.readings
          ? reCalc(
              doc.temperature.avg,
              content.temperature.avg,
              doc.reading_total,
              content.readings
            )
          : doc.temperature.avg,
      max:
        type.includes('DEVICE_UPDATE') &&
        content.temperature &&
        content.readings
          ? reCalc(
              doc.temperature.max,
              content.temperature.max,
              doc.reading_total,
              content.readings
            )
          : doc.temperature.max,
    },
    humidity: {
      min:
        type.includes('DEVICE_UPDATE') && content.humidity && content.readings
          ? reCalc(
              doc.humidity.min,
              content.humidity.min,
              doc.reading_total,
              content.readings
            )
          : doc.temperature.min,
      avg:
        type.includes('DEVICE_UPDATE') && content.humidity && content.readings
          ? reCalc(
              doc.humidity.avg,
              content.humidity.avg,
              doc.reading_total,
              content.readings
            )
          : doc.humidity.avg,
      max:
        type.includes('DEVICE_UPDATE') && content.humidity && content.readings
          ? reCalc(
              doc.humidity.max,
              content.humidity.max,
              doc.reading_total,
              content.readings
            )
          : doc.temperature.max,
    },
    light: {
      shade:
        type.includes('DEVICE_UPDATE') && content.light && content.readings
          ? reCalc(
              doc.light.shade,
              content.light.shade,
              doc.reading_total,
              content.readings
            )
          : doc.light.shade,
      half_shade:
        type.includes('DEVICE_UPDATE') && content.light && content.readings
          ? reCalc(
              doc.light.half_shade,
              content.light.half_shade,
              doc.reading_total,
              content.readings
            )
          : doc.light.half_shade,
      full_sun:
        type.includes('DEVICE_UPDATE') && content.light && content.readings
          ? reCalc(
              doc.light.full_sun,
              content.light.full_sun,
              doc.reading_total,
              content.readings
            )
          : doc.light.full_sun,
      avg:
        type.includes('DEVICE_UPDATE') && content.light && content.readings
          ? reCalc(
              doc.light.avg,
              content.light.avg,
              doc.reading_total,
              content.readings
            )
          : doc.light.avg,
      max:
        type.includes('DEVICE_UPDATE') &&
        content.light &&
        content.readings &&
        content.light.max > doc.light.max
          ? content.light.max
          : doc.light.avg,
    },
  };

  return newAgg;
};
//Plants
export const plantCreated = functions.firestore
  .document('mimirPlants/{plant_id}')
  .onCreate((plant) => {
    const batch = db.batch();
    const newPlant = db.collection('mimirPlants').doc(plant.id);
    const newAgg = newPlant.collection('Aggs').doc('--init--');

    batch.set(newAgg, initPlantAggs(timestamp));
    batch.set(
      stats,
      {
        last_added: timestamp,
        plants_total: increment(1),
        alive_total: increment(1),
        type: {
          [plant.data().type]: increment(1),
        },
        form: {
          [plant.data().form]: increment(1),
        },
        family: {
          [plant.data().species.family]: increment(1),
        },
        genus: {
          [plant.data().species.genus]: increment(1),
        },
        species: {
          [plant.data().species.id]: increment(1),
        },
        size: {
          [plant.data().pot.size]: increment(1),
        },
      },
      { merge: true }
    );

    return batch.commit();
  });

export const plantUpdated = functions.firestore
  .document('mimirPlants/{plant_id}')
  .onUpdate(async (plant, context) => {
    const plantBefore = plant.before.data() as PlantProps;
    const plantAfter = plant.after.data() as PlantProps;
    const plant_id = context.params.plant_id;

    const batchArr: FirebaseFirestore.WriteBatch[] = [];
    batchArr.push(db.batch());
    let opCounter = 0;
    let batchIndex = 0;

    const docSnapArr: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[] = [];
    const plantsSnapArr: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[] = [];

    const oldPlant: PlantType = {
      botanical_name: plantBefore.species.id,
      type: plantBefore.species.type,
      id: plant_id,
      nickname: plantBefore.nickname,
      size: plantBefore.pot.size,
    };
    const updatedPlant: PlantType = {
      botanical_name: plantAfter.species.id,
      type: plantAfter.species.type,
      id: plant_id,
      nickname: plantAfter.nickname,
      size: plantAfter.pot.size,
    };

    if (oldPlant !== updatedPlant) {
      await db
        .collection('mimirWaterings')
        .where('plant_ids', 'array-contains', plant_id)
        .get()
        .then((snap) => snap.docs.forEach((doc) => docSnapArr.push(doc)));
      await db
        .collection('mimirInspections')
        .where('plant.id', 'array-contains', plant_id)
        .get()
        .then((snap) => snap.docs.forEach((doc) => plantsSnapArr.push(doc)));
      await db
        .collectionGroup('Configs')
        .where('plant_ids', 'array-contains', plant_id)
        .where('current', '==', true)
        .get()
        .then((snap) => snap.docs.forEach((doc) => plantsSnapArr.push(doc)));
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
          [plantBefore.species.type || 'UNDEFINED']: increment(
            plantBefore.form === plantAfter.form ? 0 : -1
          ),
          [plantAfter.species.type || 'UNDEFINED']: increment(
            plantBefore.form === plantAfter.form ? 0 : 1
          ),
        },
        form: {
          [plantBefore.form || 'UNDEFINED']: increment(
            plantBefore.form === plantAfter.form ? 0 : -1
          ),
          [plantAfter.form || 'UNDEFINED']: increment(
            plantBefore.form === plantAfter.form ? 0 : 1
          ),
        },
        genus: {
          [plantBefore.species.genus || 'UNDEFINED']: increment(
            plantBefore.species.genus === plantAfter.species.genus ? 0 : -1
          ),
          [plantAfter.species.genus || 'UNDEFINED']: increment(
            plantBefore.species.genus === plantAfter.species.genus ? 0 : 1
          ),
        },
        species: {
          [plantBefore.species.species || 'UNDEFINED']: increment(
            plantBefore.species.species === plantAfter.species.species ? 0 : -1
          ),
          [plantAfter.species.species || 'UNDEFINED']: increment(
            plantBefore.species.species === plantAfter.species.species ? 0 : 1
          ),
        },
        family: {
          [plantBefore.species.family || 'UNDEFINED']: increment(
            plantBefore.species.family === plantAfter.species.family ? 0 : -1
          ),
          [plantAfter.species.family || 'UNDEFINED']: increment(
            plantBefore.species.family === plantAfter.species.family ? 0 : 1
          ),
        },
        size: {
          [Math.round(plantBefore.pot.size || 0)]: increment(
            plantBefore.pot.size === plantAfter.pot.size ? 0 : -1
          ),
          [Math.round(plantAfter.pot.size || 0)]: increment(
            plantBefore.pot.size === plantAfter.pot.size ? 0 : 1
          ),
        },
      },
      { merge: true }
    );
    return batchArr.forEach(async (batch) => await batch.commit());
  });

export const plantAggregation = functions.firestore
  .document('mimirPlants/{plant_id}/Logs/{log_id}')
  .onCreate((log, context) => {
    const plant_id = context.params.plant_id;
    const plant = db.collection('mimirPlants').doc(plant_id);
    const newAgg = plant.collection('Aggs').doc();
    const oldAgg = plant
      .collection('Aggs')
      .orderBy('timestamp', 'desc')
      .limit(1);

    return db
      .runTransaction(async (t) => {
        const doc = (await t.get(oldAgg)).docs[0].data() as PlantAggProps;

        t.set(newAgg, calcPlantAgg(doc, log.data() as Log));
      })
      .catch((error) => console.error(error));
  });
