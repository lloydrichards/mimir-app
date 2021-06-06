import {DeviceRegisterInput, DeviceType} from '@mimir/DeviceType';
import {InspectionInput} from '@mimir/InspectionType';
import {PlantDetailProps, PlantInput, PlantType} from '@mimir/PlantType';
import {SpaceDetailProps, SpaceInput, SpaceType} from '@mimir/SpaceType';
import {UserDetailProps, UserType} from '@mimir/UserType';
import {WateringInput} from '@mimir/WateringType';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import functions, {
  FirebaseFunctionsTypes,
} from '@react-native-firebase/functions';
import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {AuthRoute} from 'src/Routes/authStack';
import {usePlantObserver} from '../Helpers/usePlantObserver';
import {useSpaceObserver} from '../Helpers/useSpaceObserver';
import {useUserObserver} from '../Helpers/useUserObserver';
import Center from '../Molecule-UI/Center';
import {device_MOVE} from './functions/device_MOVE';
import {device_REGISTER} from './functions/device_REGISTER';
import {inspection_ADD} from './functions/inspection_ADD';
import {plant_ADD} from './functions/plant_ADD';
import {plant_EDIT} from './functions/plant_EDIT';
import {plant_MOVE} from './functions/plant_MOVE';
import {space_ADD} from './functions/space_ADD';
import {space_EDIT} from './functions/space_EDIT';
import {watering_ADD} from './functions/watering_add';

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
    add: (space: SpaceType, input: PlantInput) => Promise<PlantType>;
    edit: (
      space: SpaceType,
      plant: PlantType,
      edit: Partial<PlantInput>,
    ) => Promise<void>;
    water: (
      space: SpaceType,
      plant: PlantType,
      input: WateringInput,
    ) => Promise<void>;
    move: (plant: PlantType, toSpace: SpaceType) => Promise<PlantType>;
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
  addInspection: (
    space: SpaceType,
    plant: PlantType,
    input: InspectionInput,
  ) => Promise<void>;
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

  const signUp = (email: string, password: string) => {
    return auth().createUserWithEmailAndPassword(email, password);
  };

  const login = (email: string, password: string) => {
    return auth().signInWithEmailAndPassword(email, password);
  };

  const movePlant = (plant: PlantType, toSpace: SpaceType) => {
    return plant_MOVE(user, plant, toSpace);
  };
  const moveDevice = (device: DeviceType, toSpace: SpaceType) => {
    return device_MOVE(user, device, toSpace);
  };
  const inviteToSpace = (from: string, space_id: string, token: string) => {
    return functions().httpsCallable('InviteSpace')({from, space_id, token});
  };

  const addInspection = (
    space: SpaceType,
    plant: PlantType,
    input: InspectionInput,
  ) => {
    return inspection_ADD(user, space, plant, input);
  };

  const addWatering = (
    space: SpaceType,
    plant: PlantType,
    input: WateringInput,
  ) => {
    return watering_ADD(user, space, plant, input);
  };

  const editPlant = (
    space: SpaceType,
    plant: PlantType,
    edit: Partial<PlantInput>,
  ) => {
    return plant_EDIT(user, space, plant, edit);
  };

  const addSpace = (input: SpaceInput) => {
    return space_ADD(user, input);
  };

  const addPlant = (space: SpaceType, input: PlantInput) => {
    return plant_ADD(user, space, input);
  };

  const registerDevice = (space: SpaceType, input: DeviceRegisterInput) => {
    return device_REGISTER(user, space, input);
  };

  const editSpace = (space: SpaceType, edit: Partial<SpaceInput>) => {
    return space_EDIT(user, space, edit);
  };

  const resetPassword = (email: string) => {
    return auth().sendPasswordResetEmail(email);
  };
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(
      (user: FirebaseAuthTypes.User | null) => {
        setCurrentUser(user);
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
        addInspection,
        authenticated: currentUser !== null,
      }}>
      {currentUser ? children : <AuthRoute />}
    </AuthContext.Provider>
  );
};
