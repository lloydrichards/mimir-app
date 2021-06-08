import firestore from '@react-native-firebase/firestore';

import {
  SpaceLogsCollection,
  SpacesCollection,
  timestamp,
} from '../../../Services/firebase';
import {Log} from '@mimir/LogType';
import {SpaceInput, SpaceProps, SpaceType} from '@mimir/SpaceType';
import {UserType} from '@mimir/UserType';
import {
  newSpaceRefs,
  spaceRefs,
  userRefs,
} from 'src/Components/Helpers/firestoreUtil';

export const space_ADD = (user: UserType, input: SpaceInput) => {
  //Ref Doc
  const {userNewLogRef} = userRefs(user.id);
  const {newSpaceDocRef, spaceNewLogRef} = newSpaceRefs();

  const space: SpaceType = {
    id: newSpaceDocRef.id,
    name: input.name,
    room_type: input.room_type,
    light_direction: input.light_direction,
  };

  if (input.picture) {
    space.thumb = input.picture.thumb;
  }

  const log: Log = {
    timestamp,
    type: ['SPACE_CREATED', 'USER_UPDATED'],
    content: {
      user,
      space,
    },
  };
  const newSpace: SpaceProps = {
    ...input,
    date_created: timestamp,
    date_modified: null,
    roles: {[user.id]: 'ADMIN'},
  };
  return newSpaceDocRef
    .set(newSpace)
    .then(() => {
      const batch = firestore().batch();
      //Add Logs on Success
      batch.set(userNewLogRef, log);
      batch.set(spaceNewLogRef, log);
      return batch.commit();
    })
    .then(() => {
      // --------------------------
      // TODO: Add Google Analytics Event here
      // --------------------------

      return space;
    });
};
