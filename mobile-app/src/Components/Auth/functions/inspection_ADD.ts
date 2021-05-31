import firestore from '@react-native-firebase/firestore';
import {timestamp} from '../../../Services/firebase';
import {InspectionInput, InspectionProps} from '@mimir/InspectionType';
import {Log} from '@mimir/LogType';
import {PlantType} from '@mimir/PlantType';
import {SpaceType} from '@mimir/SpaceType';
import {UserType} from '@mimir/UserType';

export const inspection_ADD = (
  user: UserType,
  space: SpaceType,
  plant: PlantType,
  inspectionInput: InspectionInput,
) => {
  const batch = firestore().batch();

  //Doc Refs
  const userRef = firestore().collection('mimirUsers').doc(user.id);
  const spaceRef = firestore().collection('mimirSpaces').doc(space.id);
  const plantRef = firestore().collection('mimirPlants').doc(plant.id);
  const inspectionRef = firestore().collection('Inspections').doc();

  //Logs
  const userLog = userRef.collection('Logs').doc();
  const spaceLog = spaceRef.collection('Logs').doc();
  const plantLog = plantRef.collection('Logs').doc();

  const newInspection: InspectionProps = {
    ...inspectionInput,
    timestamp,
    created_by: user,
    space,
    plant,
  };

  const newLog: Log = {
    timestamp,
    type: [],
    content: {
      user,
      plant,
      space,
      inspection: {
        id: inspectionRef.id,
        created_by: user,
        flowering: inspectionInput.flowering,
        fruiting: inspectionInput.fruiting,
        leafing: inspectionInput.leafing,
        root_bound: inspectionInput.root_bound,
        happiness: inspectionInput.happiness,
        health: inspectionInput.health,
        pests: inspectionInput.pests,
        problems: inspectionInput.problems,
      },
    },
  };

  batch.set(inspectionRef, newInspection);

  batch.set(userLog, newLog);
  batch.set(spaceLog, newLog);
  batch.set(plantLog, newLog);

  return batch.commit();
};
