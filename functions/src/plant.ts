import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { initPlantAggs } from './docs/plants';

const timestamp = admin.firestore.FieldValue.serverTimestamp();
const increment = admin.firestore.FieldValue.increment;
const db = admin.firestore();

//Plants
export const plantCreated = functions.firestore
  .document('mimirPlants/{plant_id}')
  .onCreate((plant) => {
    const batch = db.batch();

    const newPlant = db.collection('mimirPlants').doc(plant.id);
    const newAgg = newPlant.collection('Aggs').doc('--init--');
    const stats = db.collection('Admin').doc('--plants-stats--');

    batch.set(newAgg, initPlantAggs(timestamp));
    batch.set(
      stats,
      {
        last_added: timestamp,
        plants_total: increment(1),
        alive_total: increment(1),
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
  .onUpdate((plant) => {
    const batch = db.batch();
    const plantBefore = plant.before.data();
    const plantAfter = plant.after.data();

    const stats = db.collection('Admin').doc('--plants-stats--');
    batch.set(
      stats,
      {
        last_added: timestamp,
        dead_total: increment(plantBefore.alive && !plantAfter.alive ? 1 : 0),
        alive_total: increment(plantBefore.alive && !plantAfter.alive ? -1 : 0),
        form: {
          [plantBefore.form || 'undefined']: increment(
            plantBefore.form === plantAfter.form ? 0 : -1
          ),
          [plantAfter.form || 'undefined']: increment(
            plantBefore.form === plantAfter.form ? 0 : 1
          ),
        },
        size: {
          [plantBefore.size || 'undefined']: increment(
            plantBefore.size === plantAfter.family ? 0 : -1
          ),
          [plantAfter.size || 'undefined']: increment(
            plantBefore.size === plantAfter.size ? 0 : 1
          ),
        },
      },
      { merge: true }
    );
    return batch.commit();
  });