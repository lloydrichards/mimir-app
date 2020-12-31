import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../../firebase';
import firebase from 'firebase';

type ContextProps = {
  currentUser: firebase.User | null;
  signUp: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  login: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  authenticated: boolean;
};

export const AuthContext = React.createContext<ContextProps>(
  {} as ContextProps
);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState(null as firebase.User | null);
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
        signUp,
        login,
        authenticated: currentUser !== null,
      }}>
      {!loadingAuthState && children}
    </AuthContext.Provider>
  );
};
