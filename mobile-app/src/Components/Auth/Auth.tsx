import {DeviceRegisterInput, DeviceType} from '@mimir/DeviceType';
import {
  InspectionType,
  PlantDetailProps,
  PlantInput,
  PlantType,
  PotType,
  WateringInput,
  WaterType,
} from '@mimir/PlantType';
import {SpaceDetailProps, SpaceInput, SpaceType} from '@mimir/SpaceType';
import {UserDetailProps, UserType} from '@mimir/UserType';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import functions, {
  FirebaseFunctionsTypes,
} from '@react-native-firebase/functions';
import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {AuthRoute} from '../../Routes/authStack';
import {usePlantObserver} from '../Helpers/usePlantObserver';
import {useSpaceObserver} from '../Helpers/useSpaceObserver';
import {useUserObserver} from '../Helpers/useUserObserver';
import Center from '../Molecule-UI/Center';
import {device_MOVE} from './functions/device_MOVE';
import {device_REGISTER} from './functions/device_REGISTER';
import {plant_ADD} from './functions/plant_ADD';
import {plant_EDIT} from './functions/plant_EDIT';
import {plant_INSPECT} from './functions/plant_INSPECT';
import {plant_MOVE} from './functions/plant_MOVE';
import {space_ADD} from './functions/space_ADD';
import {space_EDIT} from './functions/space_EDIT';
import {watering_ADD} from './functions/plant_WATER';
import {plant_MOOD} from './functions/plant_MOOD';

type ContextProps = {
  currentUser: FirebaseAuthTypes.User | null;
  userDoc: UserDetailProps | null;
  spaceDocs: SpaceDetailProps[];
  plantDocs: PlantDetailProps[];
  signUp: (
    email: string,
    password: string,
  ) => Promise<FirebaseAuthTypes.UserCredential>;
  login: (
    email: string,
    password: string,
  ) => Promise<FirebaseAuthTypes.UserCredential>;
  plant: {
    add: (
      space: SpaceType,
      input: PlantInput,
      pot: PotType,
    ) => Promise<PlantType>;
    edit: (
      space: SpaceType,
      plant: PlantType,
      edit: Partial<PlantInput>,
    ) => Promise<void>;
    water: (
      space: SpaceType,
      plant: PlantType,
      input: WateringInput,
    ) => Promise<WaterType>;
    move: (plant: PlantType, toSpace: SpaceType) => Promise<PlantType>;
    inspect: (
      plant: PlantType,
      space: SpaceType,
      inspection: InspectionType,
    ) => Promise<InspectionType>;
    mood: (
      plant: PlantType,
      space: SpaceType,
      data: {
        happiness: number;
        health: number;
      },
    ) => Promise<InspectionType>;
  };
  space: {
    add: (input: SpaceInput) => Promise<SpaceType>;
    edit: (space: SpaceType, edit: Partial<SpaceInput>) => Promise<void>;
  };
  device: {
    register: (
      space: SpaceType,
      input: DeviceRegisterInput,
    ) => Promise<DeviceType>;
    move: (device: DeviceType, toSpace: SpaceType) => Promise<any>;
  };
  inviteToSpace: (
    from: string,
    space_id: string,
    token: string,
  ) => Promise<FirebaseFunctionsTypes.HttpsCallableResult>;
  resetPassword: (email: string) => Promise<void>;
  authenticated: boolean;
};

export const AuthContext = React.createContext<ContextProps>(
  {} as ContextProps,
);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}: any) => {
  const [initializing, setInitializing] = useState(true);
  const [currentUser, setCurrentUser] =
    useState<FirebaseAuthTypes.User | null>(null);
  const userDoc = useUserObserver(currentUser);
  const spaceDocs = useSpaceObserver(currentUser);
  const plantDocs = usePlantObserver(currentUser);
  const user: UserType = {
    id: currentUser?.uid || '',
    username: userDoc?.username || '',
  };

  // -------------
  // Auth Functions
  // -------------
  const signUp = (email: string, password: string) =>
    auth().createUserWithEmailAndPassword(email, password);

  const login = (email: string, password: string) =>
    auth().signInWithEmailAndPassword(email, password);

  const resetPassword = (email: string) => auth().sendPasswordResetEmail(email);

  // -------------
  // Plant Functions
  // -------------
  const addPlant = (space: SpaceType, input: PlantInput, pot: PotType) =>
    plant_ADD(user, space, input, pot);

  const editPlant = (
    space: SpaceType,
    plant: PlantType,
    edit: Partial<PlantInput>,
  ) => plant_EDIT(user, space, plant, edit);

  const addWatering = (
    space: SpaceType,
    plant: PlantType,
    input: WateringInput,
  ) => watering_ADD(user, space, plant, input);

  const addInspection = (
    plant: PlantType,
    space: SpaceType,
    inspection: InspectionType,
  ) => plant_INSPECT(user, plant, space, inspection);

  const addPlantMood = (
    plant: PlantType,
    space: SpaceType,
    data: {
      happiness: number;
      health: number;
    },
  ) =>
    plant_MOOD(user, plant, space, {
      happiness: data.happiness,
      health: data.health,
    });

  const movePlant = (plant: PlantType, toSpace: SpaceType) =>
    plant_MOVE(user, plant, toSpace);

  // -------------
  // Space Functions
  // -------------
  const addSpace = (input: SpaceInput) => space_ADD(user, input);

  const editSpace = (space: SpaceType, edit: Partial<SpaceInput>) =>
    space_EDIT(user, space, edit);

  const inviteToSpace = (from: string, space_id: string, token: string) =>
    functions().httpsCallable('InviteSpace')({from, space_id, token});

  // -------------
  // Device Functions
  // -------------
  const registerDevice = (space: SpaceType, input: DeviceRegisterInput) =>
    device_REGISTER(user, space, input);

  const moveDevice = (device: DeviceType, toSpace: SpaceType) =>
    device_MOVE(user, device, toSpace);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(
      (user: FirebaseAuthTypes.User | null) => {
        setCurrentUser(user);

        // --------------------------
        // TODO: Set Google Analytics Audience here
        // TODO: Add Google Analytics Event here
        // --------------------------

        initializing && setInitializing(false);
      },
    );
    return unsubscribe;
  }, []);

  if (initializing)
    return (
      <Center>
        <ActivityIndicator size="large" />
      </Center>
    );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userDoc,
        spaceDocs,
        plantDocs,
        signUp,
        login,
        resetPassword,
        plant: {
          add: addPlant,
          edit: editPlant,
          move: movePlant,
          water: addWatering,
          inspect: addInspection,
          mood: addPlantMood,
        },
        space: {
          add: addSpace,
          edit: editSpace,
        },
        device: {
          move: moveDevice,
          register: registerDevice,
        },
        inviteToSpace,
        authenticated: currentUser !== null,
      }}>
      {currentUser ? children : <AuthRoute />}
    </AuthContext.Provider>
  );
};
