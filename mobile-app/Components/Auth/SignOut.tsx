import auth from '@react-native-firebase/auth';
import {Button} from 'react-native';
import {useAuth} from './Auth';

const SignOut = () => {
  const {currentUser} = useAuth();
  return (
    <Button
      title="Sign Out"
      disabled={!currentUser}
      onPress={async () =>
        await auth()
          .signOut()
          .then(() => console.log('Successfully Signed Out'))
      }
    />
  );
};

export default SignOut;
