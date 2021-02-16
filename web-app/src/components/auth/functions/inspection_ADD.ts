import { db, timestamp } from '../../../firebase';
import {
  InspectionInput,
  InspectionProps
} from '../../../types/InspectionType';
import { Log } from '../../../types/LogType';
import { PlantType } from '../../../types/PlantType';
import { SpaceType } from '../../../types/SpaceType';
import { UserType } from '../../../types/UserType';

export const inspection_ADD = (
  user: UserType,
  space: SpaceType,
  plant: PlantType,
  inspectionInput: InspectionInput
) => {
  const batch = db.batch();

  //Doc Refs
  const userRef = db.collection('mimirUsers').doc(user.id);
  const spaceRef = db.collection('mimirSpaces').doc(space.id);
  const plantRef = db.collection('mimirPlants').doc(plant.id);
  const inspectionRef = db.collection('Inspections').doc();

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
