import React from 'react';
import {View, Text} from 'react-native';
import Login from 'src/Components/Auth/Login';
import Center from 'src/Components/Molecule-UI/Center';
import {AuthNavProps} from 'src/Routes/authStack';

const ForgottenPasswordScreen = ({
  navigation,
  route,
}: AuthNavProps<'ForgottenPassword'>) => {
  return (
    <Center>
      <Text>Forgotten Password</Text>
    </Center>
  );
};

export default ForgottenPasswordScreen;
