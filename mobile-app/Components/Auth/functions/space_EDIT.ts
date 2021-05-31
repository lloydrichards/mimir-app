import firestore from '@react-native-firebase/firestore';

import { timestamp } from "../../../firebase";
import { Log } from "../../../../types/LogType";
import { SpaceInput, SpaceType } from "../../../../types/SpaceType";
import { UserType } from "../../../../types/UserType";

export const space_EDIT = (
  user: UserType,
  space: SpaceType,
  edit: Partial<SpaceInput>
) => {
  const batch = firestore().batch();

  //Set Refs
  //Doc Refs
  const userRef = firestore().collection("mimirUsers").doc(user.id);
  const spaceRef = firestore().collection("mimirSpaces").doc(space.id);

  //Logs
  const userLog = userRef.collection("Logs").doc();
  const spaceLog = spaceRef.collection("Logs").doc();

  const newLog: Log = {
    timestamp,
    type: ["PLANT_UPDATED"],
    content: {
      user,
      space,
    },
  };

  batch.update(spaceRef, { ...edit, date_modified: timestamp });

  batch.set(userLog, newLog);
  batch.set(spaceLog, newLog);
  return batch.commit();
};
