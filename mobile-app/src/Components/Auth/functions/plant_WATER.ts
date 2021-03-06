import firestore from '@react-native-firebase/firestore';
import {timeFormat, timeParse} from 'd3';

import {Log} from '@mimir/LogType';
import {SpaceType} from '@mimir/SpaceType';
import {UserType} from '@mimir/UserType';
import {WateringInput, WateringProps, WaterType} from '@mimir/PlantType';
import {UsersCollection, PlantWateringsCollection} from 'src/Services/firebase';
import {
  spaceRefs,
  userRefs,
  plantRefs,
} from 'src/Components/Helpers/firestoreUtil';
import {PlantType} from '@mimir/PlantType';
import {formatDate} from 'src/Components/Helpers/formatUtil';

export const watering_ADD = (
  user: UserType,
  space: SpaceType,
  plant: PlantType,
  input: WateringInput,
) => {
  const batch = firestore().batch();

  //Doc Ref
  const {userNewLogRef} = userRefs(user.id);
  const {spaceNewLogRef} = spaceRefs(space.id);
  const {plantNewLogRef, plantDocRef} = plantRefs(plant.id);

  const wateringRef = plantDocRef
    .collection(PlantWateringsCollection)
    .doc(formatDate(input.timestamp.toDate()));

  //new Documents
  const newWateringDoc: WateringProps = {
    ...input,
    created_by: user,
    space,
    plant,
  };

  const water: WaterType = {
    id: wateringRef.id,
    created_by: user,
    fertilizer: input.fertilizer,
  };
  const newLog: Log = {
    timestamp: input.timestamp,
    type: [
      'WATERING_CREATED',
      'SPACE_UPDATED',
      'PLANT_UPDATED',
      'USER_UPDATED',
    ],
    content: {
      user,
      space,
      plant,
      water: {
        id: wateringRef.id,
        created_by: user,
        fertilizer: input.fertilizer,
      },
    },
  };

  //Batch Files
  batch.set(wateringRef, newWateringDoc);

  batch.set(userNewLogRef, newLog);
  batch.set(spaceNewLogRef, newLog);
  batch.set(plantNewLogRef, newLog);

  return batch.commit().then(() => {
    // --------------------------
    // TODO: Add Google Analytics Event here
    // --------------------------
    return water;
  });
};
