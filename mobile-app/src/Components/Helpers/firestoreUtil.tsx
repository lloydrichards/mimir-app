import firestore from '@react-native-firebase/firestore';
import {
  DeviceLogsCollection,
  DevicesCollection,
  DeviceSettingsCollection,
  PlantAggsCollection,
  PlantConfigCollection,
  PlantLogsCollection,
  PlantsCollection,
  SpaceAggsCollection,
  SpaceConfigCollection,
  SpaceLogsCollection,
  SpacesCollection,
  UserAggsCollection,
  UserLogsCollection,
  UsersCollection,
  UserSettingsCollection,
} from 'src/Services/firebase';

export const userRefs = (uid: string) => {
  const userDocRef = firestore().collection(UsersCollection).doc(uid);
  const userSettingsRef = userDocRef
    .collection(UserSettingsCollection)
    .doc('--settings--');
  const userNewLogRef = userDocRef.collection(UserLogsCollection).doc();
  const userLatestAggRef = userDocRef
    .collection(UserAggsCollection)
    .orderBy('timestamp', 'desc')
    .limit(1);
  const userAllSpacesRef = firestore()
    .collection(SpacesCollection)
    .where(`roles.${uid}`, '>=', '');
  const userAllPlantsRef = firestore()
    .collection(PlantsCollection)
    .where(`roles.${uid}`, '>=', '');

  return {
    userDocRef,
    userSettingsRef,
    userNewLogRef,
    userLatestAggRef,
    userAllSpacesRef,
    userAllPlantsRef,
  };
};
export const spaceRefs = (id: string) => {
  const spaceDocRef = firestore().collection(SpacesCollection).doc(id);
  const spaceNewConfigRef = spaceDocRef.collection(SpaceConfigCollection).doc();
  const spaceNewLogRef = spaceDocRef.collection(SpaceLogsCollection).doc();
  const spaceCurrentConfigRef = spaceDocRef
    .collection(SpaceConfigCollection)
    .where('current', '==', true)
    .orderBy('timestamp', 'desc');
  const spaceLatestAggRef = spaceDocRef
    .collection(SpaceAggsCollection)
    .orderBy('timestamp', 'desc')
    .limit(1);
  return {
    spaceDocRef,
    spaceNewConfigRef,
    spaceNewLogRef,
    spaceLatestAggRef,
    spaceCurrentConfigRef,
  };
};
export const newSpaceRefs = () => {
  const newSpaceDocRef = firestore().collection(SpacesCollection).doc();
  const spaceNewConfigRef = newSpaceDocRef
    .collection(SpaceConfigCollection)
    .doc();
  const spaceNewLogRef = newSpaceDocRef.collection(SpaceLogsCollection).doc();

  return {
    newSpaceDocRef,
    spaceNewConfigRef,
    spaceNewLogRef,
  };
};
export const plantRefs = (id: string) => {
  const plantDocRef = firestore().collection(PlantsCollection).doc(id);
  const plantNewConfigRef = plantDocRef.collection(PlantConfigCollection).doc();
  const plantNewLogRef = plantDocRef.collection(PlantLogsCollection).doc();
  const plantCurrentConfigRef = plantDocRef
    .collection(PlantConfigCollection)
    .where('current', '==', true)
    .orderBy('timestamp', 'desc');
  const plantLatestAggRef = plantDocRef
    .collection(PlantAggsCollection)
    .orderBy('timestamp', 'desc')
    .limit(1);
  const plantCurrentSpaceConfigRef = firestore()
    .collectionGroup(SpaceConfigCollection)
    .where('current', '==', true)
    .where('plant_ids', 'array-contains', id)
    .orderBy('timestamp', 'desc');
  return {
    plantDocRef,
    plantNewConfigRef,
    plantNewLogRef,
    plantLatestAggRef,
    plantCurrentConfigRef,
    plantCurrentSpaceConfigRef,
  };
};

export const newPlantRefs = () => {
  const newPlantDocRef = firestore().collection(PlantsCollection).doc();
  const plantNewConfigRef = newPlantDocRef
    .collection(PlantConfigCollection)
    .doc();
  const plantNewLogRef = newPlantDocRef.collection(PlantLogsCollection).doc();

  return {
    newPlantDocRef,
    plantNewConfigRef,
    plantNewLogRef,
  };
};

export const deviceRefs = (id: string) => {
  const deviceDocRef = firestore().collection(DevicesCollection).doc(id);
  const deviceSettingsRef = deviceDocRef
    .collection(DeviceSettingsCollection)
    .doc('--settings--');
  const deviceNewLogRef = deviceDocRef.collection(DeviceLogsCollection).doc();
  const deviceCurrentSpaceConfigRef = firestore()
    .collectionGroup(SpaceConfigCollection)
    .where('current', '==', true)
    .where('device_ids', 'array-contains', id)
    .orderBy('timestamp', 'desc');
  return {
    deviceDocRef,
    deviceSettingsRef,
    deviceNewLogRef,
    deviceCurrentSpaceConfigRef,
  };
};
