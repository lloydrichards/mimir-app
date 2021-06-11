import { COLOUR_SECONDARY } from '@styles/Colours';
import React from 'react';
import {View, Text} from 'react-native';
import { Button } from 'react-native-paper';
import Login from 'src/Components/Auth/Login';
import Center from 'src/Components/Molecule-UI/Center';
import {AuthNavProps} from 'src/Routes/authStack';

const LoginScreen = ({navigation, route}: AuthNavProps<'Login'>) => {
  return (
    <Center>
      <Login />
      <Button color={COLOUR_SECONDARY} onPress={()=>navigation.navigate("Register")}>Register</Button>
    </Center>
  );
};

export default LoginScreen;
