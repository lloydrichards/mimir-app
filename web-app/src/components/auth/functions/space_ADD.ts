import { db, timestamp } from '../../../firebase';
import { Log } from '../../../types/LogType';
import { SpaceInput, SpaceProps } from '../../../types/SpaceType';
import { UserType } from '../../../types/UserType';

export const space_ADD = (user: UserType, input: SpaceInput) => {
  const batch = db.batch();

  //Ref Doc
  //Dco Refs
  const userRef = db.collection('mimirUsers').doc(user.id);
  const spaceRef = db.collection('mimirSpaces').doc();

  //Log Refs
  const userLog = userRef.collection('Logs').doc();
  const spaceLog = spaceRef.collection('Logs').doc();

  const log: Log = {
    timestamp,
    type: ['SPACE_CREATED', 'USER_UPDATED'],
    content: {
      user,
      space: {
        id: spaceRef.id,
        name: input.name,
        light_direction: input.light_direction,
        room_type: input.room_type,
        thumb: input.picture?.thumb || '',
      },
    },
  };
  const newSpace: SpaceProps = {
    ...input,
    date_created: timestamp,
    date_modified: null,
    roles: { [user.id]: 'ADMIN' },
  };

  batch.set(spaceRef, newSpace);

  batch.set(userLog, log);
  batch.set(spaceLog, log);

  return batch.commit();
};
