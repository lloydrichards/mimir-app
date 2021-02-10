import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import algoliasearch from 'algoliasearch';
import { SpeciesProps } from './types/SpeciesType';
import { SpeciesType } from './types/PlantType';

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('mimirSpecies');

const db = admin.firestore();

export const addToIndex = functions.firestore
  .document('mimirSpecies/{species_id}')
  .onCreate((species) => {
    const speciesData = species.data() as SpeciesProps;
    const objectID = species.id;

    return index.saveObject({ ...speciesData, objectID });
  });
export const updateSpecies = functions.firestore
  .document('mimirSpecies/{species_id}')
  .onUpdate(async (species, context) => {
    const speciesData = species.after.data() as SpeciesProps;
    const objectID = species.after.id;
    await index.saveObject({ ...speciesData, objectID });

    const speciesBefore = species.before.data() as SpeciesProps;
    const speciesAfter = species.after.data() as SpeciesProps;
    const species_id = context.params.space_id;
    if (speciesBefore === speciesAfter) return;

    const batchArr: FirebaseFirestore.WriteBatch[] = [];
    batchArr.push(db.batch());
    let opCounter = 0;
    let batchIndex = 0;

    const docSnapArr: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[] = [];

    const oldSpecies: SpeciesType = {
      id: species_id,
      family: speciesBefore.family,
      genus: speciesBefore.genus,
      species: speciesBefore.species,
      subspecies: speciesBefore.subspecies,
      cultivar: speciesBefore.cultivar,
      type: speciesBefore.type,
    };
    const updatedSpecies: SpeciesType = {
      id: species_id,
      family: speciesAfter.family,
      genus: speciesAfter.genus,
      species: speciesAfter.species,
      subspecies: speciesAfter.subspecies,
      cultivar: speciesAfter.cultivar,
      type: speciesAfter.type,
    };

    if (oldSpecies !== updatedSpecies) {
      await db
        .collection('mimirPlants')
        .where('species.id', '==', species_id)
        .get()
        .then((snap) => snap.docs.forEach((doc) => docSnapArr.push(doc)));
    }

    docSnapArr.forEach((docSnap) => {
      batchArr[batchIndex].update(docSnap.ref, { species: updatedSpecies });
      opCounter++;

      if (opCounter === 499) {
        batchArr.push(db.batch());
        batchIndex++;
        opCounter = 0;
      }
    });

    return batchArr.forEach(async (batch) => await batch.commit());
  });

export const deleteFromIndex = functions.firestore
  .document('mimirSpecies/{species_id}')
  .onDelete((species) => {
    const objectID = species.id;

    return index.deleteObject(objectID);
  });
