import {DeviceProps, DeviceRegisterInput, DeviceType} from '@mimir/DeviceType';
import {Log} from '@mimir/LogType';
import {SpaceConfigProps, SpaceType} from '@mimir/SpaceType';
import {UserType} from '@mimir/UserType';
import firestore from '@react-native-firebase/firestore';
import {
  deviceRefs,
  spaceRefs,
  userRefs,
} from 'src/Components/Helpers/firestoreUtil';
import {timestamp} from '../../../Services/firebase';

export const device_REGISTER = async (
  user: UserType,
  space: SpaceType,
  input: DeviceRegisterInput,
) => {
  //Dco Refs
  const {userNewLogRef} = userRefs(user.id);
  const {spaceNewLogRef, spaceCurrentConfigRef, spaceNewConfigRef} = spaceRefs(
    space.id,
  );
  const {deviceNewLogRef, deviceDocRef} = deviceRefs(input.id);
  const deviceDoc = (await deviceDocRef.get()).data() as DeviceProps;

  const newLog: Log = {
    timestamp,
    type: ['DEVICE_REGISTERED', 'SPACE_UPDATED', 'USER_UPDATED'],
    content: {
      user,
      space,
      device: {
        id: input.id,
        nickname: input.nickname,
        type: deviceDoc.version.type,
      },
    },
  };

  return firestore()
    .runTransaction(async t => {
      const currentConfigDoc = await spaceCurrentConfigRef.get();
      if (currentConfigDoc.empty) throw new Error('No Config');

      const currentDoc = currentConfigDoc.docs[0].data() as SpaceConfigProps;
      const newConfig: SpaceConfigProps = {
        ...currentDoc,
        timestamp,
        device_ids: currentDoc.device_ids.concat(input.id),
        devices: [
          ...currentDoc.devices,
          {
            id: input.id,
            nickname: input.nickname,
            type: deviceDoc.version.type,
          },
        ],
      };

      const newSpace: Partial<DeviceProps> = {
        ...input,
        date_registered: timestamp,
        date_modified: null,
        roles: {[user.id]: 'ADMIN'},
      };

      t.update(deviceDocRef, input);
      t.set(spaceNewConfigRef, newConfig);

      t.set(userNewLogRef, newLog);
      t.set(spaceNewLogRef, newLog);
      t.set(deviceNewLogRef, newLog);

      currentConfigDoc.docs.forEach(doc => t.update(doc.ref, {current: false}));
    })
    .then(() => {
      const device: DeviceType = {
        id: input.id,
        nickname: input.nickname,
        type: deviceDoc.version.type,
      };
      return device;
    });
};
