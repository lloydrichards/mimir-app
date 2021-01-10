import { Button } from '@material-ui/core';
import React from 'react';
import firebase from '../../firebase';
import { useAuth } from './Auth';

const SignOut = () => {
  const { currentUser } = useAuth();
  return (
    <Button
      disabled={!currentUser}
      onClick={async () =>
        await firebase
          .auth()
          .signOut()
          .then(() => console.log('Successfully Signed Out'))
      }>
      Sign Out
    </Button>
  );
};

export default SignOut;
