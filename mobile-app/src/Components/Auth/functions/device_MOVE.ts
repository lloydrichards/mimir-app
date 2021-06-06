import {Log} from '@mimir/LogType';
import {PlantType} from '@mimir/PlantType';
import {DeviceType} from '@mimir/DeviceType';
import {SpaceConfigProps, SpaceProps, SpaceType} from '@mimir/SpaceType';
import {UserType} from '@mimir/UserType';
import firestore from '@react-native-firebase/firestore';
import {
  deviceRefs,
  plantRefs,
  spaceRefs,
  userRefs,
} from 'src/Components/Helpers/firestoreUtil';
import {
  SpaceLogsCollection,
  SpacesCollection,
  timestamp,
} from '../../../Services/firebase';

export const device_MOVE = (
  user: UserType,
  device: DeviceType,
  toSpace: SpaceType,
) => {
  return firestore().runTransaction(async t => {
    const {userNewLogRef} = userRefs(user.id);
    const {deviceCurrentSpaceConfigRef, deviceNewLogRef} = deviceRefs(
      device.id,
    );

    const fromSpaceConfigRefs = await deviceCurrentSpaceConfigRef.get();
    if (fromSpaceConfigRefs.empty)
      throw new Error(`Device (${device.id}) is not in a space`);
    const fromSpaceRef = fromSpaceConfigRefs.docs[0].ref.parent.parent;
    if (!fromSpaceRef) throw new Error('No From Space Doc');
    const {
      spaceDocRef: fromSpaceDocRef,
      spaceNewConfigRef: fromSpaceNewConfigRef,
      spaceNewLogRef: fromSpaceNewLogRef,
    } = spaceRefs(fromSpaceRef.id);
    const {
      spaceCurrentConfigRef: toSpaceCurrentConfigRef,
      spaceNewConfigRef: toSpaceNewConfigRef,
      spaceNewLogRef: toSpaceNewLogRef,
    } = spaceRefs(toSpace.id);

    const fromSpaceDoc = (await (
      await t.get(fromSpaceDocRef)
    ).data()) as SpaceProps;
    const fromSpaceConfig =
      fromSpaceConfigRefs.docs[0].data() as SpaceConfigProps;
    const toSpaceConfigRefs = await toSpaceCurrentConfigRef.get();
    const toSpaceConfig = toSpaceConfigRefs.docs[0].data() as SpaceConfigProps;

    const newLog: Log = {
      timestamp,
      type: ['USER_UPDATED', 'DEVICE_MOVED', 'SPACE_UPDATED'],
      content: {
        user,
        fromSpace: {
          id: fromSpaceDocRef.id,
          name: fromSpaceDoc.name,
          light_direction: fromSpaceDoc.light_direction,
          room_type: fromSpaceDoc.room_type,
          thumb: fromSpaceDoc.picture?.thumb || '',
        },
        toSpace,
        device,
      },
    };
    const newFromSpaceConfig: SpaceConfigProps = {
      ...fromSpaceConfig,
      timestamp,
      current: true,
      device_ids: fromSpaceConfig.device_ids.filter(d => d !== device.id),
      devices: fromSpaceConfig.devices.filter(d => d.id !== device.id),
    };
    const newToSpaceConfig: SpaceConfigProps = {
      ...toSpaceConfig,
      timestamp,
      current: true,
      device_ids: [...fromSpaceConfig.device_ids, device.id],
      devices: [...fromSpaceConfig.devices, device],
    };

    t.set(fromSpaceNewConfigRef, newFromSpaceConfig);
    t.set(toSpaceNewConfigRef, newToSpaceConfig);

    t.set(userNewLogRef, newLog);
    t.set(fromSpaceNewLogRef, newLog);
    t.set(toSpaceNewLogRef, newLog);
    t.set(deviceNewLogRef, newLog);

    fromSpaceConfigRefs.docs.forEach(d => t.update(d.ref, {current: false}));
    toSpaceConfigRefs.docs.forEach(d => t.update(d.ref, {current: false}));
  });
};
