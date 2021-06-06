import {Log} from '@mimir/LogType';
import {PlantInput, PlantType} from '@mimir/PlantType';
import {SpaceType} from '@mimir/SpaceType';
import {UserType} from '@mimir/UserType';
import firestore from '@react-native-firebase/firestore';
import {
  plantRefs,
  spaceRefs,
  userRefs,
} from 'src/Components/Helpers/firestoreUtil';
import {timestamp} from '../../../Services/firebase';

export const plant_EDIT = (
  user: UserType,
  space: SpaceType,
  plant: PlantType,
  edit: Partial<PlantInput>,
) => {
  const batch = firestore().batch();

  //Set Refs
  const {userNewLogRef} = userRefs(user.id);
  const {spaceNewLogRef} = spaceRefs(space.id);
  const {plantDocRef, plantNewLogRef} = plantRefs(plant.id);
  const newLog: Log = {
    timestamp,
    type: ['PLANT_UPDATED'],
    content: {
      user,
      space,
      plant,
    },
  };

  batch.update(plantDocRef, {...edit, date_modified: timestamp});

  batch.set(userNewLogRef, newLog);
  batch.set(plantNewLogRef, newLog);
  batch.set(spaceNewLogRef, newLog);
  return batch.commit();
};
