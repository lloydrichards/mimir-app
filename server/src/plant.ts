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

export const plant_MOVED = (
  user_id: string,
  plant_id: string,
  fromSpace_id: string,
  toSpace_id: string
) => {
  const plant = db.collection('mimirPlants').doc(plant_id);
  const fromSpace = db.collection('mimirSpaces').doc(fromSpace_id);
  const toSpace = db.collection('mimirSpaces').doc(toSpace_id);
  const fromConfig = fromSpace
    .collection('Configs')
    .where('plant_ids', 'array-contains', plant_id)
    .where('current', '==', true)
    .orderBy('timestamp', 'desc');
  const toConfig = toSpace
    .collection('Configs')
    .where('current', '==', true)
    .orderBy('timestamp', 'desc');
  const newToConfig = toSpace.collection('Configs').doc();
  const newFromConfig = fromSpace.collection('Configs').doc();

  const fromLog = fromSpace.collection('Logs').doc();
  const toLog = fromSpace.collection('Logs').doc();
  const userLog = db
    .collection('mimirUsers')
    .doc(user_id)
    .collection('Logs')
    .doc();
  const plantLog = db
    .collection('mimirPlants')
    .doc(plant_id)
    .collection('Logs')
    .doc();

  const newLog: Log = {
    timestamp,
    type: ['PLANT_MOVED', 'POINTS'],
    content: {
      user_id,
      fromSpace: fromSpace_id,
      toSpace: toSpace_id,
      plant_id,
      points: 5,
    },
  };

  return db
    .runTransaction(async (t) => {
      const fromConfigDoc = await t.get(fromConfig);
      if (fromConfigDoc.docs.length === 0) throw 'No Plant found at Space';
      const toConfigDoc = await t.get(toConfig);
      const plantDoc = (await t.get(plant)).data() as PlantProps;

      const currentToConfig = toConfigDoc.docs[0].data() as SpaceConfigProps;
      const currentFromConfig = fromConfigDoc.docs[0].data() as SpaceConfigProps;

      t.set(newToConfig, {
        ...currentToConfig,
        timestamp,
        current: true,
        plant_ids: currentToConfig.plant_ids.concat(plant_id),
        plants: [
          ...currentToConfig.plants,
          {
            nickname: plantDoc.nickname,
            id: plant_id,
            botanical_name: plantDoc.species.id,
            size: plantDoc.pot.size,
          },
        ],
      } as SpaceConfigProps);
      t.set(newFromConfig, {
        ...currentFromConfig,
        timestamp,
        current: true,
        plant_ids: currentFromConfig.plant_ids.filter((i) => i !== plant_id),
        plants: currentFromConfig.plants.filter((i) => i?.id !== plant_id),
      } as SpaceConfigProps);

      t.set(userLog, newLog);
      t.set(toLog, newLog);
      t.set(fromLog, newLog);
      t.set(plantLog, newLog);

      fromConfigDoc.docs.map((i) => t.update(i.ref, { current: false }));
      toConfigDoc.docs.map((i) => t.update(i.ref, { current: false }));
    })
    .catch((error) => console.log(error));
};
