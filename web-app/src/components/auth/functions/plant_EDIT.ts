import { db, timestamp } from '../../../firebase';
import { Log } from '../../../types/LogType';
import { PlantInputProps, PlantType } from '../../../types/PlantType';
import { SpaceType } from '../../../types/SpaceType';
import { UserType } from '../../../types/UserType';

export const plant_EDIT = (
  user: UserType,
  space: SpaceType,
  plant: PlantType,
  edit: Partial<PlantInputProps>
) => {
  const batch = db.batch();

  //Set Refs
  //Doc Refs
  const userRef = db.collection('mimirUsers').doc(user.id);
  const spaceRef = db.collection('mimirSpaces').doc(space.id);
  const plantRef = db.collection('mimirPlants').doc(plant.id);

  //Logs
  const userLog = userRef.collection('Logs').doc();
  const plantLog = plantRef.collection('Logs').doc();

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
  return batch.commit();
};
