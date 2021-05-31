import React from 'react';
import auth from '@react-native-firebase/auth';
import {useAuth} from './Auth';
import {COLOUR_SECONDARY} from 'src/Styles/Colours';
import { Button } from 'react-native-paper';

const SignOut = () => {
  const {currentUser} = useAuth();
  return (
    <Button
      disabled={!currentUser}
      onPress={async () =>
        await auth()
          .signOut()
          .then(() => console.log('Successfully Signed Out'))
      }>
      Sign Out
    </Button>
  );
};

export default SignOut;
