import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../../firebase';
import firebase from 'firebase';
import { UserProps } from '../../types/UserType';

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
        authenticated: currentUser !== null,
      }}>
      {!loadingAuthState && children}
    </AuthContext.Provider>
  );
};
