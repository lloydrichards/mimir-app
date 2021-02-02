import * as admin from 'firebase-admin';

admin.initializeApp();

export { deviceCreated, deviceUpdated } from './device';
export { plantCreated, plantUpdated } from './plant';
export { sensorReadings, dailyReading, readingTest } from './reading';
export { spaceCreated, spaceUpdated } from './space';
export { userCreated, userUpdated, userAggregation } from './user';
export { addToIndex, deleteFromIndex, updateIndex } from './species';
