import { db, timestamp } from './app';
import { Log } from './GenericType';
import { PlantCreateInput, PlantProps } from './PlantType';
import { SpaceConfigProps } from './SpaceType';

export const plant_CREATE = (
  user_id: string,
  space_id: string,
  plantInput: PlantCreateInput
) => {
  const space = db.collection('mimirSpaces').doc(space_id);
  const spaceConfigs = space
    .collection('Configs')
    .where('current', '==', true)
    .orderBy('timestamp', 'desc');
  const newConfig = space.collection('Configs').doc();
  const newPlant = db.collection('mimirPlants').doc();
  const userLog = db
    .collection('mimirUsers')
    .doc(user_id)
    .collection('Logs')
    .doc();
  const spaceLog = space.collection('Logs').doc();
  const plantLog = newPlant.collection('Logs').doc();

  const newPlantDoc: PlantProps = {
    ...plantInput,
    alive: true,
    date_created: timestamp,
    date_modified: null,
    roles: {
      [user_id]: 'ADMIN',
    },
  };

  const newLog: Log = {
    timestamp,
    type: ['PLANT_CREATED', 'POINTS'],
    content: {
      user_id,
      space_id,
      plant_id: newPlant.id,
      points: 5,
    },
  };

  return db
    .runTransaction(async (t) => {
      const configs = await t.get(spaceConfigs);
      const currentConfig = configs.docs[0].data() as SpaceConfigProps;

      console.log(currentConfig);
      t.set(newConfig, {
        ...currentConfig,
        timestamp,
        current: true,
        plant_ids: currentConfig.plant_ids.concat(newPlant.id),
        plants: [
          ...currentConfig.plants,
          {
            nickname: plantInput.nickname,
            id: newPlant.id,
            botanical_name: plantInput.species.id,
            size: plantInput.pot.size,
          },
        ],
      } as SpaceConfigProps);
      t.set(newPlant, newPlantDoc);
      t.set(userLog, newLog);
      t.set(spaceLog, newLog);
      t.set(plantLog, newLog);

      configs.docs.map((i) => t.update(i.ref, { current: false }));
    })
    .catch((error) => console.error(error));
};
