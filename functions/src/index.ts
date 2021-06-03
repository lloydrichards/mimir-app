import * as admin from "firebase-admin";
import { FirebaseTimestamp } from "../../types/GenericType";

admin.initializeApp();
export const db = admin.firestore();
export const increment = admin.firestore.FieldValue.increment;
export const timestamp =
  admin.firestore.FieldValue.serverTimestamp() as FirebaseTimestamp;

// User Functions
export { userCreated } from "./User/UserCreated";

// Space Functions
export { spaceCreated } from "./Space/SpaceCreated";
