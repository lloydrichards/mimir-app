import firebase from 'firebase';
import React, { useContext, useEffect, useState } from 'react';
import { auth, functions } from '../../firebase';
import { InspectionInputProps } from '../../types/InspectionType';
import { PlantInputProps, PlantType } from '../../types/PlantType';
import { SpaceType } from '../../types/SpaceType';
import { UserProps, UserType } from '../../types/UserType';
import { WateringInputProps } from '../../types/WateringType';
import { inspection_ADD } from './functions/inspection_ADD';
import { plant_ADD } from './functions/plant_ADD';
import { plant_EDIT } from './functions/plant_EDIT';
import { watering_ADD } from './functions/watering_add';

type ContextProps = {
  currentUser: firebase.User | null;
  userDoc: UserProps | null;
  signUp: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  login: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  movePlant: (
    plant: PlantType,
    toSpace: SpaceType
  ) => Promise<firebase.functions.HttpsCallableResult>;
  moveDevice: (
    device_id: string,
    toSpace: SpaceType
  ) => Promise<firebase.functions.HttpsCallableResult>;
  addInspection: (
    space: SpaceType,
    plant: PlantType,
    input: InspectionInputProps
  ) => Promise<void>;
  editPlant: (
    space: SpaceType,
    plant: PlantType,
    edit: Partial<PlantInputProps>
  ) => Promise<void>;
  addPlant: (space: SpaceType, input: PlantInputProps) => Promise<void>;
  addWatering: (space: SpaceType, input: WateringInputProps) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  authenticated: boolean;
  setUserDoc: React.Dispatch<React.SetStateAction<UserProps | null>>;
};

export const AuthContext = React.createContext<ContextProps>(
  {} as ContextProps
);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState(null as firebase.User | null);
  const [userDoc, setUserDoc] = useState(null as UserProps | null);
  const [loadingAuthState, setLoadingAuthState] = useState(true);

  const user: UserType = {
    id: currentUser?.uid || '',
    username: userDoc?.username || '',
    gardener: userDoc?.gardener || 'BEGINNER',
  };

  const signUp = (email: string, password: string) => {
    return auth.createUserWithEmailAndPassword(email, password);
  };

  const login = (email: string, password: string) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const movePlant = (plant: PlantType, toSpace: SpaceType) => {
    return functions.httpsCallable('movePlant')({ user, plant, toSpace });
  };
  const moveDevice = (device_id: string, toSpace: SpaceType) => {
    return functions.httpsCallable('moveDevice')({ user, device_id, toSpace });
  };

  const addInspection = (
    space: SpaceType,
    plant: PlantType,
    input: InspectionInputProps
  ) => {
    return inspection_ADD(user, space, plant, input);
  };

  const addWatering = (space: SpaceType, input: WateringInputProps) => {
    return watering_ADD(user, space, input);
  };

  const editPlant = (
    space: SpaceType,
    plant: PlantType,
    edit: Partial<PlantInputProps>
  ) => {
    return plant_EDIT(user, space, plant, edit);
  };

  const addPlant = (space: SpaceType, input: PlantInputProps) => {
    return plant_ADD(user, space, input);
  };

  const resetPassword = (email: string) => {
    return auth.sendPasswordResetEmail(email);
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user: firebase.User | null) => {
        setCurrentUser(user);
        setLoadingAuthState(false);
      }
    );
    return unsubscribe;
  }, []);

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
        moveDevice,
        addInspection,
        addWatering,
        editPlant,
        addPlant,
        authenticated: currentUser !== null,
      }}>
      {!loadingAuthState && children}
    </AuthContext.Provider>
  );
};
