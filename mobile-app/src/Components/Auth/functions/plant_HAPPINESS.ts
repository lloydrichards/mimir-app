import {Log} from '@mimir/LogType';
import {InspectionType, PlantConfig, PlantType} from '@mimir/PlantType';
import {SpaceType} from '@mimir/SpaceType';
import {UserType} from '@mimir/UserType';
import firestore from '@react-native-firebase/firestore';
import {
  plantRefs,
  spaceRefs,
  userRefs,
} from 'src/Components/Helpers/firestoreUtil';
import {timestamp} from '../../../Services/firebase';

export const plant_HAPPINESS = async (
  user: UserType,
  plant: PlantType,
  space: SpaceType,
  happiness: number,
) => {
  const {userNewLogRef} = userRefs(user.id);
  const {plantNewLogRef, plantCurrentConfigRef, plantNewConfigRef} = plantRefs(
    plant.id,
  );
  const {spaceNewLogRef} = spaceRefs(space.id);

  const plantConfigDocs = await plantCurrentConfigRef.get();
  const currentPlantConfigDoc = plantConfigDocs.docs[0].data() as PlantConfig;

  const inspection: InspectionType = {
    flowering: currentPlantConfigDoc.flowering,
    fruiting: currentPlantConfigDoc.fruiting,
    leafing: currentPlantConfigDoc.leafing,
    root_bound: currentPlantConfigDoc.root_bound,
    health: currentPlantConfigDoc.health,
    happiness,
    problems: currentPlantConfigDoc.problems,
    pests: currentPlantConfigDoc.pests,
  };
  return firestore()
    .runTransaction(async t => {
      const newLog: Log = {
        timestamp,
        type: [
          'USER_UPDATED',
          'INSPECTION_CREATED',
          'PLANT_UPDATED',
          'SPACE_UPDATED',
        ],
        content: {
          user,
          space,
          plant,
          inspection,
        },
      };
      const newPlantConfig: PlantConfig = {
        ...currentPlantConfigDoc,
        timestamp,
        current: true,
        happiness,
      };

      t.set(plantNewConfigRef, newPlantConfig);

      t.set(userNewLogRef, newLog);
      t.set(spaceNewLogRef, newLog);
      t.set(plantNewLogRef, newLog);

      plantConfigDocs.docs.forEach(d => t.update(d.ref, {current: false}));
    })
    .then(() => {
      // --------------------------
      // TODO: Add Google Analytics Event here
      // --------------------------
      return inspection;
    });
};
