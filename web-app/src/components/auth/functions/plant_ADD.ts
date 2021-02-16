import { db, timestamp } from '../../../firebase';
import { Log } from '../../../types/LogType';
import { PlantInputProps, PlantProps } from '../../../types/PlantType';
import { SpaceConfigProps, SpaceType } from '../../../types/SpaceType';
import { UserType } from '../../../types/UserType';

export const plant_ADD = (
  user: UserType,
  space: SpaceType,
  input: PlantInputProps
) => {
  //Dco Refs
  const userRef = db.collection('mimirUsers').doc(user.id);
  const plantRef = db.collection('mimirPlants').doc();
  const spaceRef = db.collection('mimirSpaces').doc(space.id);

  //Log Refs
  const userLog = userRef.collection('Logs').doc();
  const spaceLog = spaceRef.collection('Logs').doc();
  const plantLog = plantRef.collection('Logs').doc();

  const newLog: Log = {
    timestamp,
    type: ['PLANT_CREATED', 'SPACE_UPDATED', 'USER_UPDATED'],
    content: {
      user,
      space,
      plant: {
        id: plantRef.id,
        nickname: input.nickname,
        type: input.species.type,
        botanical_name: input.species.id,
        size: input.pot.size,
      },
    },
  };

  return db.runTransaction(async (t) => {
    const currentConfig = spaceRef
      .collection('Configs')
      .where('current', '==', true)
      .orderBy('timestamp', 'desc');
    const newConfigRef = spaceRef.collection('Configs').doc();

    const currentConfigDoc = await currentConfig.get();
    if (currentConfigDoc.empty) throw new Error('No Config');

    const currentDoc = currentConfigDoc.docs[0].data() as SpaceConfigProps;
    const newConfig: SpaceConfigProps = {
      ...currentDoc,
      timestamp,
      plant_ids: currentDoc.plant_ids.concat(plantRef.id),
      plants: [
        ...currentDoc.plants,
        {
          id: plantRef.id,
          nickname: input.nickname,
          type: input.species.type,
          botanical_name: input.species.id,
          size: input.pot.size,
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
      pot: input.pot,
      picture: input.picture,
      roles: {
        [user.id]: 'ADMIN',
      },
      species: input.species,
    };

    t.set(plantRef, newPlantDoc);
    t.set(newConfigRef, newConfig);
    
    t.set(userLog, newLog);
    t.set(spaceLog, newLog);
    t.set(plantLog, newLog);

    currentConfigDoc.docs.forEach((doc) =>
      t.update(doc.ref, { current: false })
    );
  });
};
