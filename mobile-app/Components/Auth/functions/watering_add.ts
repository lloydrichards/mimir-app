import firestore from '@react-native-firebase/firestore';

import {Log} from '../../../../types/LogType';
import {SpaceType} from '../../../../types/SpaceType';
import {UserType} from '../../../../types/UserType';
import {WateringInput, WateringProps} from '../../../../types/WateringType';

export const watering_ADD = (
  user: UserType,
  space: SpaceType,
  input: WateringInput,
) => {
  const batch = firestore().batch();

  //Doc Ref
  const userRef = firestore().collection('mimirUsers').doc(user.id);
  const spaceRef = firestore().collection('mimirSpaces').doc(space.id);
  const plantRefs = input.plant_ids.map(i =>
    firestore().collection('mimirPlants').doc(i),
  );
  const wateringRef = firestore().collection('Waterings').doc();

  //Log Ref
  const userLog = userRef.collection('Logs').doc();
  const spaceLog = spaceRef.collection('Logs').doc();

  //new Documents
  const newWateringDoc: WateringProps = {
    ...input,
    created_by: user,
    space,
  };
  const newLog: Log = {
    timestamp: input.date_created,
    type: ['WATERING', 'SPACE_UPDATED'],
    content: {
      water: {
        id: wateringRef.id,
        created_by: user,
        fertilizer: input.fertilizer,
      },
    },
  };

  //Batch Files
  batch.set(wateringRef, newWateringDoc);

  batch.set(userLog, newLog);
  batch.set(spaceLog, newLog);
  plantRefs.forEach(ref => batch.set(ref.collection('Logs').doc(), newLog));

  return batch.commit();
};
