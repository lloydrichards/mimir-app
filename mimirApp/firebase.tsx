import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

export const timestamp =
  firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp;
