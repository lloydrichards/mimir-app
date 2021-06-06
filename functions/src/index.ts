import * as admin from "firebase-admin";
import { FirebaseTimestamp } from "../../types/GenericType";

admin.initializeApp();
export const db = admin.firestore();
export const increment = admin.firestore.FieldValue.increment;
export const timestamp =
  admin.firestore.FieldValue.serverTimestamp() as FirebaseTimestamp;

// User Functions
export { userCreated } from "./User/UserCreated";
export { userAggregation } from "./User/UserAggs";
export { userDeleted } from "./User/UserDeleted";
export { userSettingsUpdated, userUpdated } from "./User/UserUpdated";

// Space Functions
export { spaceCreated } from "./Space/SpaceCreated";
export { spaceAggregation } from "./Space/SpaceAggs";
export { spaceUpdated } from "./Space/SpaceUpdated";
export {} from "./Space/SpaceDeleted";

// Plant Functions
export { plantCreated } from "./Plant/PlantCreated";
export { plantAggregation } from "./Plant/PlantAggs";
export { plantUpdated } from "./Plant/PlantUpdated";
