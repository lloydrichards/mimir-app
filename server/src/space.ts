import { db, timestamp } from './app';
import { Log } from './GenericType';
import { SpaceCreateInput, SpaceProps } from './SpaceType';

export const space_CREATE = (user_id: string, data: SpaceCreateInput) => {
  const batch = db.batch();
  const newSpace = db.collection('mimirSpaces').doc();
  const spaceLog = newSpace.collection('Logs').doc();
  const userLog = db
    .collection('mimirUsers')
    .doc(user_id)
    .collection('Logs')
    .doc();
  const initSpaceLog: Log = {
    timestamp,
    type: ['SPACE_CREATED', 'POINTS'],
    content: {
      device_id: newSpace.id,
      created_by: user_id,
      points: 10,
    },
  };

  const initSpaceDoc: SpaceProps = {
    ...data,
    date_created: timestamp,
    date_modified: null,
    roles: { [user_id]: 'ADMIN' },
  };

  batch.set(newSpace, initSpaceDoc);
  batch.set(spaceLog, initSpaceLog);
  batch.set(userLog, initSpaceLog);

  return batch
    .commit()
    .then(() => console.log('Successfully added Space!'))
    .catch((error) => console.error(error));
};
