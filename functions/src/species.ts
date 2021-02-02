import * as functions from 'firebase-functions';
import algoliasearch from 'algoliasearch';
import { SpeciesProps } from './types/SpeciesType';

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('mimirSpecies');

export const addToIndex = functions.firestore
  .document('mimirSpecies/{species_id}')
  .onCreate((species) => {
    const speciesData = species.data() as SpeciesProps;
    const objectID = species.id;

    return index.saveObject({ ...speciesData, objectID });
  });
export const updateIndex = functions.firestore
  .document('mimirSpecies/{species_id}')
  .onUpdate((species) => {
    const speciesData = species.after.data() as SpeciesProps;
    const objectID = species.after.id;

    return index.saveObject({ ...speciesData, objectID });
  });
export const deleteFromIndex = functions.firestore
  .document('mimirSpecies/{species_id}')
  .onDelete((species) => {
    const objectID = species.id;

    return index.deleteObject(objectID);
  });
