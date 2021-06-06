import {Log} from '@mimir/LogType';
import {PlantType} from '@mimir/PlantType';
import {SpaceConfigProps, SpaceProps, SpaceType} from '@mimir/SpaceType';
import {UserType} from '@mimir/UserType';
import firestore from '@react-native-firebase/firestore';
import {
  plantRefs,
  spaceRefs,
  userRefs,
} from 'src/Components/Helpers/firestoreUtil';
import {
  SpaceLogsCollection,
  SpacesCollection,
  timestamp,
} from '../../../Services/firebase';

export const plant_MOVE = (
  user: UserType,
  plant: PlantType,
  toSpace: SpaceType,
) => {
  return firestore().runTransaction(async t => {
    const {userNewLogRef} = userRefs(user.id);
    const {plantCurrentSpaceConfigRef, plantNewLogRef} = plantRefs(plant.id);

    const fromSpaceConfigRefs = await plantCurrentSpaceConfigRef.get();
    if (fromSpaceConfigRefs.empty)
      throw new Error(`Plant (${plant.id}) is not in a space`);
    const fromSpaceRef = fromSpaceConfigRefs.docs[0].ref.parent.parent;
    if (!fromSpaceRef) throw new Error(`Missing From Space`);
    const {
      spaceDocRef: fromSpaceDocRef,
      spaceNewConfigRef: fromSpaceNewConfigRef,
      spaceNewLogRef: fromSpaceNewLogRef,
    } = spaceRefs(fromSpaceRef.id);
    const {
      spaceCurrentConfigRef: toSpaceCurrentConfigRef,
      spaceNewConfigRef: toSpaceNewConfigRef,
      spaceNewLogRef: toSpaceNewLogRef,
    } = spaceRefs(toSpace.id);

    const fromSpaceDoc = (await (
      await t.get(fromSpaceDocRef)
    ).data()) as SpaceProps;
    const fromSpaceConfig =
      fromSpaceConfigRefs.docs[0].data() as SpaceConfigProps;
    const toSpaceConfigRefs = await toSpaceCurrentConfigRef.get();
    const toSpaceConfig = toSpaceConfigRefs.docs[0].data() as SpaceConfigProps;

    const newLog: Log = {
      timestamp,
      type: ['USER_UPDATED', 'PLANT_MOVED', 'SPACE_UPDATED'],
      content: {
        user,
        fromSpace: {
          id: fromSpaceDocRef.id,
          name: fromSpaceDoc.name,
          light_direction: fromSpaceDoc.light_direction,
          room_type: fromSpaceDoc.room_type,
          thumb: fromSpaceDoc.picture?.thumb || '',
        },
        toSpace,
        plant,
      },
    };
    const newFromSpaceConfig: SpaceConfigProps = {
      ...fromSpaceConfig,
      timestamp,
      current: true,
      plant_ids: fromSpaceConfig.plant_ids.filter(p => p !== plant.id),
      plants: fromSpaceConfig.plants.filter(p => p.id !== plant.id),
    };
    const newToSpaceConfig: SpaceConfigProps = {
      ...toSpaceConfig,
      timestamp,
      current: true,
      plant_ids: [...fromSpaceConfig.plant_ids, plant.id],
      plants: [...fromSpaceConfig.plants, plant],
    };

    t.set(fromSpaceNewConfigRef, newFromSpaceConfig);
    t.set(toSpaceNewConfigRef, newToSpaceConfig);

    t.set(userNewLogRef, newLog);
    t.set(fromSpaceNewLogRef, newLog);
    t.set(toSpaceNewLogRef, newLog);
    t.set(plantNewLogRef, newLog);

    fromSpaceConfigRefs.docs.forEach(d => t.update(d.ref, {current: false}));
    toSpaceConfigRefs.docs.forEach(d => t.update(d.ref, {current: false}));
  });
};
