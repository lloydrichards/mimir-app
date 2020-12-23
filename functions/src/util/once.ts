import * as admin from 'firebase-admin';
import { EventContext } from 'firebase-functions';

export function once<EventData>(
  eventHandler: (data: EventData, context: EventContext) => Promise<any>
) {
  return async (data: EventData, context: EventContext) => {
    await admin.firestore().runTransaction(async (transaction) => {
      const eventRef = admin.firestore().doc(`_events/${context.eventId}`);
      const eventDoc = await transaction.get(eventRef);
      if (eventDoc.exists && eventDoc.data()?.success)
        throw new Error('Event already successfully processed');
      transaction.set(eventRef, {
        eventId: context.eventId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    return eventHandler(data, context);
  };
}

export function setEventSuccess(
  transaction: admin.firestore.Transaction,
  context: EventContext
): admin.firestore.Transaction {
  const eventRef = admin.firestore().doc(`_events/${context.eventId}`);
  return transaction.set(
    eventRef,
    { success: true, successAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );
}
