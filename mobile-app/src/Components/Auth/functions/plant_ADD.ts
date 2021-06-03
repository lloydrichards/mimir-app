import firestore from '@react-native-firebase/firestore';

import {timestamp} from '../../../Services/firebase';
import {Log} from '@mimir/LogType';
import {PlantInput, PlantProps, PlantType} from '@mimir/PlantType';
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
) => {
  //Dco Refs
  const {userNewLogRef} = userRefs(user.id);
  const {spaceNewLogRef, spaceCurrentConfigRef, spaceNewConfigRef} = spaceRefs(
    space.id,
  );
  const {newPlantDocRef, plantNewLogRef} = newPlantRefs();

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
        form: input.form,
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
    .then(() => plantNewLogRef.set(newLog))
    .then(() => {
      const plant: PlantType = {
        id: newPlantDocRef.id,
        botanical_name: input.species.id,
        nickname: input.nickname,
        type: input.species.type,
      };

      return plant;
    });
};
