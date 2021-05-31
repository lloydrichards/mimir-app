import firestore from '@react-native-firebase/firestore';

import { timestamp } from '../../../Services/firebase';
import { Log } from '@mimir/LogType';
import { PlantInput, PlantType } from '@mimir/PlantType';
import { SpaceType } from '@mimir/SpaceType';
import { UserType } from '@mimir/UserType';

export const plant_EDIT = (
  user: UserType,
  space: SpaceType,
  plant: PlantType,
  edit: Partial<PlantInput>
) => {
  const batch = firestore().batch();

  //Set Refs
  //Doc Refs
  const userRef = firestore().collection('mimirUsers').doc(user.id);
  const spaceRef = firestore().collection('mimirSpaces').doc(space.id);
  const plantRef = firestore().collection('mimirPlants').doc(plant.id);

  //Logs
  const userLog = userRef.collection('Logs').doc();
  const plantLog = plantRef.collection('Logs').doc();
  const spaceLog = spaceRef.collection('Logs').doc();

  const newLog: Log = {
    timestamp,
    type: ['PLANT_UPDATED'],
    content: {
      user,
      space,
      plant,
    },
  };

  batch.update(plantRef, { ...edit, date_modified: timestamp });

  batch.set(userLog, newLog);
  batch.set(plantLog, newLog);
  batch.set(spaceLog, newLog);
  return batch.commit();
};
