import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import functions, {
  FirebaseFunctionsTypes,
} from '@react-native-firebase/functions';

import React, {useContext, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {InspectionInput} from '../../../types/InspectionType';
import {PlantInput, PlantType} from '../../../types/PlantType';
import {SpaceInput, SpaceType} from '../../../types/SpaceType';
import {UserProps, UserType} from '../../../types/UserType';
import {WateringInput} from '../../../types/WateringType';
import {inspection_ADD} from './functions/inspection_ADD';
import {plant_ADD} from './functions/plant_ADD';
import {plant_EDIT} from './functions/plant_EDIT';
import {space_ADD} from './functions/space_ADD';
import {space_EDIT} from './functions/space_EDIT';
import {watering_ADD} from './functions/watering_add';
import Login from './Login';

type ContextProps = {
  currentUser: FirebaseAuthTypes.User | null;
  userDoc: UserProps | null;
  signUp: (
    email: string,
    password: string,
  ) => Promise<FirebaseAuthTypes.UserCredential>;
  login: (
    email: string,
    password: string,
  ) => Promise<FirebaseAuthTypes.UserCredential>;
  movePlant: (
    plant: PlantType,
    toSpace: SpaceType,
  ) => Promise<FirebaseFunctionsTypes.HttpsCallableResult>;
  moveDevice: (
    device_id: string,
    toSpace: SpaceType,
  ) => Promise<FirebaseFunctionsTypes.HttpsCallableResult>;
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
  editPlant: (
    space: SpaceType,
    plant: PlantType,
    edit: Partial<PlantInput>,
  ) => Promise<void>;
  addPlant: (space: SpaceType, input: PlantInput) => Promise<void>;
  addWatering: (space: SpaceType, input: WateringInput) => Promise<void>;
  editSpace: (space: SpaceType, edit: Partial<SpaceInput>) => Promise<void>;
  addSpace: (input: SpaceInput) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  authenticated: boolean;
  setUserDoc: React.Dispatch<React.SetStateAction<UserProps | null>>;
};

export const AuthContext = React.createContext<ContextProps>(
  {} as ContextProps,
);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}: any) => {
  const [initializing, setInitializing] = useState(true);
  const [currentUser, setCurrentUser] = useState(
    null as FirebaseAuthTypes.User | null,
  );
  const [userDoc, setUserDoc] = useState(null as UserProps | null);

  const user: UserType = {
    id: currentUser?.uid || '',
    username: userDoc?.username || '',
    gardener: userDoc?.gardener || 'BEGINNER',
  };

  const signUp = (email: string, password: string) => {
    return auth().createUserWithEmailAndPassword(email, password);
  };

  const login = (email: string, password: string) => {
    return auth().signInWithEmailAndPassword(email, password);
  };

  const movePlant = (plant: PlantType, toSpace: SpaceType) => {
    return functions().httpsCallable('movePlant')({user, plant, toSpace});
  };
  const moveDevice = (device_id: string, toSpace: SpaceType) => {
    return functions().httpsCallable('moveDevice')({user, device_id, toSpace});
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

  const addWatering = (space: SpaceType, input: WateringInput) => {
    return watering_ADD(user, space, input);
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

  if (initializing) return null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userDoc,
        setUserDoc,
        signUp,
        login,
        resetPassword,
        movePlant,
        inviteToSpace,
        moveDevice,
        addInspection,
        addWatering,
        editPlant,
        addPlant,
        editSpace,
        addSpace,
        authenticated: currentUser !== null,
      }}>
      {currentUser ? children : <Login />}
    </AuthContext.Provider>
  );
};
