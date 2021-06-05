import firestore from '@react-native-firebase/firestore';
import {timeFormat, timeParse} from 'd3';

import {Log} from '@mimir/LogType';
import {SpaceType} from '@mimir/SpaceType';
import {UserType} from '@mimir/UserType';
import {WateringInput, WateringProps} from '@mimir/WateringType';
import {UsersCollection, PlantWateringsCollection} from 'src/Services/firebase';
import {
  spaceRefs,
  userRefs,
  plantRefs,
} from 'src/Components/Helpers/firestoreUtil';
import {PlantType} from '@mimir/PlantType';

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
    .doc(formatDate(input.date_created.toDate()));

  //Log Ref

  //new Documents
  const newWateringDoc: WateringProps = {
    ...input,
    created_by: user,
    space,
    plant,
  };
  const newLog: Log = {
    timestamp: input.date_created,
    type: ['WATERING', 'SPACE_UPDATED', 'PLANT_UPDATED'],
    content: {
      water: {
        id: wateringRef.id,
        created_by: user,
        fertilizer: input.fertilizer,
      },
      space,
      user,
      plant,
    },
  };

  //Batch Files
  batch.set(wateringRef, newWateringDoc);

  batch.set(userNewLogRef, newLog);
  batch.set(spaceNewLogRef, newLog);
  batch.set(plantNewLogRef, newLog);

  return batch.commit();
};

export const formatDate = timeFormat('%m-%d-%Y');
