import firestore from '@react-native-firebase/firestore';

import {timestamp} from '../../../Services/firebase';
import {Log} from '@mimir/LogType';
import {
  PlantConfig,
  PlantInput,
  PlantProps,
  PlantType,
  PotType,
  PotTypes,
} from '@mimir/PlantType';
import {SpaceConfigProps, SpaceType} from '@mimir/SpaceType';
import {UserType} from '@mimir/UserType';
import {
  userRefs,
  spaceRefs,
  newPlantRefs,
} from 'src/Components/Helpers/firestoreUtil';

export const plant_ADD = (
  user: UserType,
  space: SpaceType,
  input: PlantInput,
  pot: PotType,
) => {
  //Dco Refs
  const {userNewLogRef} = userRefs(user.id);
  const {spaceNewLogRef, spaceCurrentConfigRef, spaceNewConfigRef} = spaceRefs(
    space.id,
  );
  const {newPlantDocRef, plantNewLogRef, plantNewConfigRef} = newPlantRefs();

  const newLog: Log = {
    timestamp,
    type: ['PLANT_CREATED', 'SPACE_UPDATED', 'USER_UPDATED'],
    content: {
      user,
      space,
      plant: {
        id: newPlantDocRef.id,
        nickname: input.nickname,
        type: input.species.type,
        botanical_name: input.species.id,
      },
    },
  };

  const plant: PlantType = {
    id: newPlantDocRef.id,
    botanical_name: input.species.id,
    nickname: input.nickname,
    type: input.species.type,
  };

  return firestore()
    .runTransaction(async t => {
      const currentConfigDoc = await spaceCurrentConfigRef.get();
      if (currentConfigDoc.empty) throw new Error('No Config');

      const currentDoc = currentConfigDoc.docs[0].data() as SpaceConfigProps;
      const newConfig: SpaceConfigProps = {
        ...currentDoc,
        timestamp,
        plant_ids: currentDoc.plant_ids.concat(newPlantDocRef.id),
        plants: [
          ...currentDoc.plants,
          {
            id: newPlantDocRef.id,
            nickname: input.nickname,
            type: input.species.type,
            botanical_name: input.species.id,
          },
        ],
      };

      const newPlantDoc: PlantProps = {
        date_created: timestamp,
        nickname: input.nickname,
        date_modified: null,
        alive: true,
        description: input.description,
        origin: input.origin,
        owner: input.owner,
        parent: input.parent ? input.parent : null,
        picture: input.picture,
        roles: {
          [user.id]: 'ADMIN',
        },
        species: input.species,
      };

      t.set(newPlantDocRef, newPlantDoc);
      t.set(spaceNewConfigRef, newConfig);

      t.set(userNewLogRef, newLog);
      t.set(spaceNewLogRef, newLog);

      currentConfigDoc.docs.forEach(doc => t.update(doc.ref, {current: false}));
    })
    .then(() => {
      // --------------------------
      // TODO: Add Google Analytics Event here
      // --------------------------

      return Promise.all([
        plantNewLogRef.set(newLog),
        plantNewConfigRef.set(initPlantConfig(plant, pot)),
      ]);
    })
    .then(() => plant);
};

const initPlantConfig = (plant: PlantType, pot: PotType): PlantConfig => ({
  current: true,
  timestamp,
  flowering: false,
  fruiting: false,
  leafing: false,
  root_bound: false,
  happiness: 0,
  health: 0,
  pests: [],
  problems: [],
  pot,
  plant,
});
