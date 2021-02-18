import * as admin from 'firebase-admin';
import { FirebaseTimestamp } from './types/GenericType';

admin.initializeApp();
export const db = admin.firestore();
export const increment = admin.firestore.FieldValue.increment;
export const timestamp = admin.firestore.FieldValue.serverTimestamp() as FirebaseTimestamp;

export { deviceCreated, deviceUpdated } from './device';
export { plantCreated, plantUpdated } from './plant';
export { sensorReadings, dailyReading, scoreCalculatorTest } from './reading';
export { spaceCreated, spaceUpdated } from './space';
export {
  userCreated,
  userUpdated,
  userSettingsUpdate,
  userAggregation,
} from './user';
export { addToIndex, deleteFromIndex, updateSpecies } from './species';
export { movePlant } from './Plant/MovePlant';
export { moveDevice } from './Device/MoveDevice';

export { InviteSpace } from './Space/InviteSpace';
