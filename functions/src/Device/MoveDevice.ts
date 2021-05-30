import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FirebaseTimestamp } from '../../../types/GenericType';
import { SpaceConfigProps, SpaceProps, SpaceType } from '../../../types/SpaceType';
import { UserType } from '../../../types/UserType';
import { Log } from '../../../types/LogType';

const timestamp = admin.firestore.FieldValue.serverTimestamp() as FirebaseTimestamp;
const db = admin.firestore();

export const moveDevice = functions.https.onCall(
  async (data: { user: UserType; device_id: string; toSpace: SpaceType }) => {
    const { user, device_id, toSpace } = data;
    const toSpaceRef = db.collection('mimirSpaces').doc(toSpace.id);
    const toSpaceConfigs = toSpaceRef
      .collection('Configs')
      .where('current', '==', true)
      .orderBy('timestamp', 'desc');
    try {
      return db.runTransaction(async (t) => {
        const toSpaceConfigDocs = await t.get(toSpaceConfigs);
        if (toSpaceConfigDocs.empty) throw new Error('No toSpace Config');
        const curToConfig = toSpaceConfigDocs.docs[0].data() as SpaceConfigProps;
        const fromConfigRef = db
          .collectionGroup('Configs')
          .where('current', '==', true)
          .where('devices', 'array-contains', device_id)
          .orderBy('timestamp', 'desc');

        const newToConfigRef = toSpaceRef.collection('Configs').doc();

        const fromConfigDocs = await t.get(fromConfigRef);
        if (fromConfigDocs.empty) throw new Error(`No Config for ${device_id}`);
        const curConfig = fromConfigDocs.docs[0];
        const curConfigDoc = curConfig.data() as SpaceConfigProps;
        const fromSpaceRef = curConfig.ref.parent.parent;
        const newFromConfigRef = curConfig.ref.parent.doc();
        if (!fromSpaceRef)
          throw new Error(`No Space, check ${curConfig.ref.path}`);
        const fromSpaceDoc = (await t.get(fromSpaceRef)).data() as SpaceProps;

        const userLog = db
          .collection('mimirUsers')
          .doc(user.id)
          .collection('Logs')
          .doc();
        const fromSpaceLog = fromSpaceRef.collection('Logs').doc();
        const toSpaceLog = toSpaceRef.collection('Logs').doc();
        const deviceLog = db
          .collection('mimirDevices')
          .doc(device_id)
          .collection('Logs')
          .doc();

        const newLog: Log = {
          timestamp,
          type: ['DEVICE_MOVED', 'SPACE_UPDATED', 'USER_UPDATED'],
          content: {
            user,
            device_id,
            toSpace,
            fromSpace: {
              id: fromSpaceRef.id,
              name: fromSpaceDoc.name,
              light_direction: fromSpaceDoc.light_direction,
              thumb: fromSpaceDoc.picture?.thumb || '',
              room_type: fromSpaceDoc.room_type,
            },
          },
        };

        const newToConfig: SpaceConfigProps = {
          ...curToConfig,
          timestamp,
          current: true,
          devices: [...curToConfig.devices, device_id],
        };
        const newFromConfig: SpaceConfigProps = {
          ...curConfigDoc,
          timestamp,
          current: true,
          devices: curConfigDoc.devices.filter((c) => c !== device_id),
        };

        t.set(newToConfigRef, newToConfig);
        t.set(newFromConfigRef, newFromConfig);

        t.set(userLog, newLog);
        t.set(fromSpaceLog, newLog);
        t.set(toSpaceLog, newLog);
        t.set(deviceLog, newLog);

        fromConfigDocs.docs.forEach((i) => t.update(i.ref, { current: false }));
      });
    } catch (err) {
      return err;
    }
  }
);
