import React from 'react';
import firebase from '../../firebase';
import { useAuth } from './Auth';

const SignOut = () => {
  const { currentUser } = useAuth();
  return (
    <button
      disabled={!currentUser}
      onClick={async () =>
        await firebase
          .auth()
          .signOut()
          .then(() => console.log('Successfully Signed Out'))
      }>
      Sign Out
    </button>
  );
};

export default SignOut;
