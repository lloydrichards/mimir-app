import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

export const timestamp =
  firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp;

export const UsersCollection = 'Users';
export const SpacesCollection = 'Spaces';
export const PlantsCollection = 'Plants';
export const SpeciesCollection = 'Species';

export const UserSettingsCollection = '_settings';
export const UserAggsCollection = 'aggs';
export const UserLogsCollection = 'logs';

export const SpaceConfigCollection = 'configs';
export const SpaceAggsCollection = 'aggs';
export const SpaceLogsCollection = 'logs';

export const PlantConfigCollection = 'configs';
export const PlantAggsCollection = 'aggs';
export const PlantLogsCollection = 'logs';
export const PlantWateringsCollection = 'waterings';
