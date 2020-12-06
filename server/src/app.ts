import * as admin from 'firebase-admin';
import { SpaceCreateInput, SpaceProps } from './types/space/space';
var serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const timestamp = admin.firestore.FieldValue.serverTimestamp();
//const increment = admin.firestore.FieldValue.increment;

console.log('Starting mimir-app Server...');

const space_CREATE = (user_id: string, data: SpaceCreateInput) => {
  const batch = db.batch();
  const newSpace = db.collection('mimirSpaces').doc();
  const newLog = newSpace.collection('Logs').doc();

  const initSpaceLog = {
    timestamp,
    type: ['SPACE_CREATED'],
    content: {
      device_id: newSpace.id,
      created_by: user_id,
    },
  };

  const initSpaceDoc: SpaceProps = {
    ...data,
    date_created: timestamp,
    date_modified: null,
    roles: { [user_id]: 'ADMIN' },
  };

  batch.set(newSpace, initSpaceDoc);
  batch.set(newLog, initSpaceLog);

  return batch
    .commit()
    .then(() => console.log('Successfully added Space!'))
    .catch((error) => console.error(error));
};

space_CREATE('LXSJXgTDOIPiPgFDP3iVcfo0qdc2', {
  name: 'Test Space #1',
  description: 'A Space for testing things',
  room_type: 'BEDROOM',
  sun_exposure: 'HALF_SHADE',
  location: {
    region: 'Europe',
    country: 'Switzerland',
    city: 'Zurich',
    address: '',
  },
  profile_picture: {
    url: '',
    ref: '',
    thumb: '',
  },
  owner: {
    name: 'Tester',
    email: 'tester@word.com',
    id: 'LXSJXgTDOIPiPgFDP3iVcfo0qdc2',
  },
});
