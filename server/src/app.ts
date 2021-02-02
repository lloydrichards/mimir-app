import * as admin from 'firebase-admin';
import firebase from 'firebase/app';
require('firebase/functions');
import { plant_CREATE, plant_MOVED } from './plant';
import { space_CREATE } from './space';
import { ModelProps, SpeciesProps } from './SpeciesType';
var serviceAccount = require('../serviceAccountKey.json');

var combinedData: Array<
  SpeciesProps & { id: string; model: ModelProps }
> = require('../combined.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = firebase.initializeApp({
  apiKey: 'AIzaSyATtD1MmPJo9bdSRQuPghzPwI3ROcdSfE0',
  authDomain: 'mimir-app-dev.firebaseapp.com',
  projectId: 'mimir-app-dev',
  storageBucket: 'mimir-app-dev.appspot.com',
  messagingSenderId: '999550951543',
  appId: '1:999550951543:web:2822c33ea1a8ec68d36672',
  measurementId: 'G-CFQVCR1SEH',
});

const test = app.functions().httpsCallable('readingTest');

export const db = admin.firestore();
export const timestamp = admin.firestore.Timestamp.now();
//const increment = admin.firestore.FieldValue.increment;

console.log('Starting mimir-app Server...');

combinedData.forEach((s) => {
  const batch = db.batch();

  const {
    family,
    genus,
    species,
    subspecies,
    cultivar,
    description,
    common_name,
    type,
    habitat,
    form,
    origin,
    edible,
    poisonous,
    pet_friendly,
    air_purifying,
    hardiness,
    exposure,
    soil,
    water,
    height_max,
    height_min,
    spread_min,
    spread_max,
    growth_rate,
    maintenance,
    pests,
    model,
  } = s;

  const species_id = s.id;
  const speciesDoc = db.collection('mimirSpecies').doc(species_id);
  const modelDoc = speciesDoc.collection('Model').doc('--Init--');

  if (!species) return console.log(species_id, 'Missing Species');
  const doc: SpeciesProps = {
    family,
    genus,
    species,
    subspecies,
    cultivar,
    description,
    common_name,
    images: [],
    type,
    habitat,
    form,
    origin,
    edible,
    poisonous,
    pet_friendly,
    air_purifying,
    hardiness,
    exposure,
    soil,
    water,
    height_max,
    height_min,
    spread_min,
    spread_max,
    growth_rate,
    maintenance,
    pests,
  };

  batch.set(speciesDoc, doc);
  batch.set(modelDoc, { ...model, timestamp, current: true });

  return batch.commit().then(() => console.log(species_id, 'Added'));
});

// space_CREATE('LXSJXgTDOIPiPgFDP3iVcfo0qdc2', {
//   name: 'Test Space #2',
//   description: 'A Space for testing things',
//   room_type: 'BEDROOM',
//   sun_exposure: 'HALF_SHADE',
//   location: {
//     region: 'Europe',
//     country: 'Switzerland',
//     city: 'Zurich',
//     address: '',
//   },
//   profile_picture: null,
//   owner: {
//     name: 'Tester',
//     email: 'tester@word.com',
//     id: 'LXSJXgTDOIPiPgFDP3iVcfo0qdc2',
//   },
// });

// plant_CREATE('LXSJXgTDOIPiPgFDP3iVcfo0qdc2', 'jdzguo67OlB5lu3KXTpo', {
//   nickname: 'Pothos',
//   description: ' Tester Plant',
//   profile_picture: null,
//   form: 'OVAL',
//   pot: {
//     type: 'TERRACOTTA',
//     size: 17,
//     tray: true,
//     hanging: false,
//   },
//   owner: {
//     name: 'Tester',
//     email: '',
//     id: 'LXSJXgTDOIPiPgFDP3iVcfo0qdc2',
//   },
//   parent: null,
//   species: {
//     family: 'Araceae',
//     genus: 'Scindapsus',
//     species: 'pictus',
//     subspecies: '',
//     cultivar: '',
//     id: 'Scindapsus pictus',
//   },
// });

// plant_MOVED(
//   'LXSJXgTDOIPiPgFDP3iVcfo0qdc2',
//   'agHYKTtkN6CpS313rw8X',
//   'Ax7QWEsm2g33AV0UjFya',
//   'jdzguo67OlB5lu3KXTpo'
// );
