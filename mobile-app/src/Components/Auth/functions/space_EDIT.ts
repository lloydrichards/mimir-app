import firestore from '@react-native-firebase/firestore';

import {timestamp} from '../../../Services/firebase';
import {Log} from '@mimir/LogType';
import {SpaceInput, SpaceType} from '@mimir/SpaceType';
import {UserType} from '@mimir/UserType';
import {spaceRefs, userRefs} from 'src/Components/Helpers/firestoreUtil';

export const space_EDIT = (
  user: UserType,
  space: SpaceType,
  edit: Partial<SpaceInput>,
) => {
  const batch = firestore().batch();

  //Set Refs
  //Doc Refs
  const {userNewLogRef} = userRefs(user.id);
  const {spaceDocRef, spaceNewLogRef} = spaceRefs(space.id);
  const newLog: Log = {
    timestamp,
    type: ['PLANT_UPDATED'],
    content: {
      user,
      space,
    },
  };

  batch.update(spaceDocRef, {...edit, date_modified: timestamp});

  batch.set(userNewLogRef, newLog);
  batch.set(spaceNewLogRef, newLog);
  return batch.commit();
};
