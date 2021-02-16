import { db } from '../../../firebase';
import { Log } from '../../../types/LogType';
import { SpaceType } from '../../../types/SpaceType';
import { UserType } from '../../../types/UserType';
import { WateringInput, WateringProps } from '../../../types/WateringType';

export const watering_ADD = (
  user: UserType,
  space: SpaceType,
  input: WateringInput
) => {
  const batch = db.batch();

  //Doc Ref
  const userRef = db.collection('mimirUsers').doc(user.id);
  const spaceRef = db.collection('mimirSpaces').doc(space.id);
  const plantRefs = input.plant_ids.map((i) =>
    db.collection('mimirPlants').doc(i)
  );
  const wateringRef = db.collection('Waterings').doc();

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
    timestamp: input.timestamp,
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
  plantRefs.forEach((ref) => batch.set(ref.collection('Logs').doc(), newLog));

  return batch.commit();
};
