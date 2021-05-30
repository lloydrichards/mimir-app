import * as admin from 'firebase-admin';
import firebase from 'firebase/app';
import { PlantType } from '../../types/PlantType';
import { SpaceType } from '../../types/SpaceType';
import('firebase/functions');

import { ModelProps, SpeciesProps } from '../../types/SpeciesType';
import { UserType } from '../../types/UserType';
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

const testScore = app.functions().httpsCallable('scoreCalculatorTest');
const plants_MOVE = app.functions().httpsCallable('movePlant');

export const db = admin.firestore();
export const timestamp = admin.firestore.Timestamp.now();
//const increment = admin.firestore.FieldValue.increment;

console.log('Starting mimir-app Server...');

// testScore({ plant_id: 'QoDIiogM6MFuACdbLJrQ' });

const data: { user: UserType; plant: PlantType; toSpace: SpaceType } = {
  user: {
    gardener: 'BEGINNER',
    id: 'BOnlHozQMadp2zgn3WiF3iDQL8T2',
    username: 'tester',
  },
  plant: {
    botanical_name: 'Vanilla planifolia',
    id: '10Awh8CnY3rDxoxLW2SM',
    nickname: 'Vanilla Orchid',
    size: 20,
    type: 'SEMI_EVERGREEN',
  },

  toSpace: {
    id: '969KEoPkzc6nbNZm39SZ',
    name: 'Bedroom Desk',
    light_direction: ['NW', 'W', 'SW'],
    room_type: 'BEDROOM',
    thumb: '',
  },
};
plants_MOVE(data);
