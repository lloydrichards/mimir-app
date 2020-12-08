import * as admin from 'firebase-admin';
import { plant_CREATE } from './plant';
import { space_CREATE } from './space';
var serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
export const timestamp = admin.firestore.FieldValue.serverTimestamp();
//const increment = admin.firestore.FieldValue.increment;

console.log('Starting mimir-app Server...');

// space_CREATE('LXSJXgTDOIPiPgFDP3iVcfo0qdc2', {
//   name: 'Test Space #9',
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

plant_CREATE('LXSJXgTDOIPiPgFDP3iVcfo0qdc2', 'zXfNRslZf9t6S8aLxJAg', {
  nickname: 'Plant #2',
  description: ' Tester Plant',
  profile_picture: null,
  form: 'OVAL',
  pot: {
    type: 'TERRACOTTA',
    size: 17,
    tray: true,
    hanging: false,
  },
  owner: {
    name: 'Tester',
    email: '',
    id: 'LXSJXgTDOIPiPgFDP3iVcfo0qdc2',
  },
  parent: null,
  species: {
    family: 'Fam',
    genus: 'Gen',
    species: 'spp',
    subspecies: '',
    cultivar: '',
    id: 'Tester Species #2',
  },
});
