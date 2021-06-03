import { db } from "../index";
import {
  UsersCollection,
  UserSettingsCollection,
  UserLogsCollection,
  UserAggsCollection,
  SpacesCollection,
  PlantsCollection,
  SpaceConfigCollection,
  SpaceLogsCollection,
  SpaceAggsCollection,
  PlantConfigCollection,
  PlantLogsCollection,
  PlantAggsCollection,
} from "../firestore";

export const userRefs = (uid: string) => {
  const userDocRef = db.collection(UsersCollection).doc(uid);
  const userSettingsRef = userDocRef
    .collection(UserSettingsCollection)
    .doc("--settings--");
  const userNewLogRef = userDocRef.collection(UserLogsCollection).doc();
  const userNewAggRef = userDocRef.collection(UserAggsCollection).doc();
  const userLatestAggRef = userDocRef
    .collection(UserAggsCollection)
    .orderBy("timestamp", "desc")
    .limit(1);
  const userAllSpacesRef = db
    .collection(SpacesCollection)
    .where(`roles.${uid}`, ">=", "");
  const userAllPlantsRef = db
    .collection(PlantsCollection)
    .where(`roles.${uid}`, ">=", "");

  return {
    userDocRef,
    userSettingsRef,
    userNewLogRef,
    userLatestAggRef,
    userNewAggRef,
    userAllSpacesRef,
    userAllPlantsRef,
  };
};
export const spaceRefs = (id?: string) => {
  const spaceDocRef = db.collection(SpacesCollection).doc(id);
  const spaceNewConfigRef = spaceDocRef.collection(SpaceConfigCollection).doc();
  const spaceNewLogRef = spaceDocRef.collection(SpaceLogsCollection).doc();
  const spaceNewAggRef = spaceDocRef.collection(SpaceAggsCollection).doc();
  const spaceCurrentConfigRef = spaceDocRef
    .collection(SpaceConfigCollection)
    .where("current", "==", true)
    .orderBy("timestamp", "desc");
  const spaceLatestAggRef = spaceDocRef
    .collection(SpaceAggsCollection)
    .orderBy("timestamp", "desc")
    .limit(1);
  return {
    spaceDocRef,
    spaceNewConfigRef,
    spaceNewLogRef,
    spaceLatestAggRef,
    spaceCurrentConfigRef,
    spaceNewAggRef,
  };
};
export const newSpaceRefs = () => {
  const newSpaceDocRef = db.collection(SpacesCollection).doc();
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
export const plantRefs = (id?: string) => {
  const plantDocRef = db.collection(PlantsCollection).doc(id);
  const plantNewConfigRef = plantDocRef.collection(PlantConfigCollection).doc();
  const plantNewLogRef = plantDocRef.collection(PlantLogsCollection).doc();
  const plantCurrentConfigRef = plantDocRef
    .collection(PlantConfigCollection)
    .where("current", "==", true)
    .orderBy("timestamp", "desc");
  const plantLatestAggRef = plantDocRef
    .collection(PlantAggsCollection)
    .orderBy("timestamp", "desc")
    .limit(1);
  return {
    plantDocRef,
    plantNewConfigRef,
    plantNewLogRef,
    plantLatestAggRef,
    plantCurrentConfigRef,
  };
};
export const newPlantRefs = () => {
  const newPlantDocRef = db.collection(PlantsCollection).doc();
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
