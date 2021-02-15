import firebase from 'firebase';
import React, { useContext, useEffect, useState } from 'react';
import { auth, functions } from '../../firebase';
import { PlantType } from '../../types/PlantType';
import { SpaceType } from '../../types/SpaceType';
import { UserProps, UserType } from '../../types/UserType';

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
    user: UserType,
    plant: PlantType,
    toSpace: SpaceType
  ) => Promise<firebase.functions.HttpsCallableResult>;
  moveDevice: (
    user: UserType,
    device_id: string,
    toSpace: SpaceType
  ) => Promise<firebase.functions.HttpsCallableResult>;
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

  const signUp = (email: string, password: string) => {
    return auth.createUserWithEmailAndPassword(email, password);
  };

  const login = (email: string, password: string) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const movePlant = (user: UserType, plant: PlantType, toSpace: SpaceType) => {
    return functions.httpsCallable('movePlant')({ user, plant, toSpace });
  };
  const moveDevice = (
    user: UserType,
    device_id: string,
    toSpace: SpaceType
  ) => {
    return functions.httpsCallable('moveDevice')({ user, device_id, toSpace });
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
        authenticated: currentUser !== null,
      }}>
      {!loadingAuthState && children}
    </AuthContext.Provider>
  );
};
