import firestore from '@react-native-firebase/firestore';

import {timestamp} from '../../../Services/firebase';
import {Log} from '@mimir/LogType';
import {SpaceInput, SpaceProps} from '@mimir/SpaceType';
import {UserType} from '@mimir/UserType';

export const space_ADD = (user: UserType, input: SpaceInput) => {
  const batch = firestore().batch();

  //Ref Doc
  //Dco Refs
  const userRef = firestore().collection('mimirUsers').doc(user.id);
  const spaceRef = firestore().collection('mimirSpaces').doc();

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
    roles: {[user.id]: 'ADMIN'},
  };

  batch.set(spaceRef, newSpace);

  batch.set(userLog, log);
  batch.set(spaceLog, log);

  return batch.commit();
};
