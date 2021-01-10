import app, { timestamp } from '../../firebase';
import { Log } from '../../types/GenericType';
import { UserProps } from '../../types/UserType';

const db = app.firestore();

export const updateProfile = (
  userId: string,
  data: Omit<UserProps, 'date_created' | 'date_modified' | 'subscription'>
) => {
  const batch = db.batch();
  const userRef = db.collection('mimirUsers').doc(userId);
  const userLog = userRef.collection('Logs').doc();

  const newLog: Log = {
    timestamp,
    type: ['USER_UPDATED'],
    content: { user_id: userId },
  };

  batch.update(userRef, { ...data, date_modified: timestamp });
  batch.set(userLog, newLog);

  return batch.commit();
};
