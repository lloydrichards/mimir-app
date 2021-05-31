import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

export const timestamp =
  firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp;

  export const UsersCollection = "Users"
  export const SpacesCollection = "Spaces"
  export const PlantsCollection = "Plants"
  export const SpeciesCollection = "Species"