import {COLOUR_SECONDARY} from '@styles/Colours';
import React from 'react';
import {View, Text} from 'react-native';
import {Button} from 'react-native-paper';
import Login from 'src/Components/Auth/Login';
import SignUp from 'src/Components/Auth/SignUp';
import Center from 'src/Components/Molecule-UI/Center';
import {AuthNavProps} from 'src/Routes/authStack';

const RegisterScreen = ({navigation, route}: AuthNavProps<'Register'>) => {
  return (
    <Center>
      <SignUp />
      <Button
        color={COLOUR_SECONDARY}
        onPress={() => navigation.navigate('Login')}>
        Login
      </Button>
    </Center>
  );
};

export default RegisterScreen;
