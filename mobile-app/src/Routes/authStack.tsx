import {NavigationContainer, RouteProp} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React from 'react';
import ForgottenPasswordScreen from 'src/Screens/ForgottenPasswordScreen';
import LoginScreen from 'src/Screens/LoginScreen';
import RegisterScreen from 'src/Screens/RegisterScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgottenPassword: undefined;
};

export type AuthNavProps<T extends keyof AuthStackParamList> = {
  route: RouteProp<AuthStackParamList, T>;
  navigation: StackNavigationProp<AuthStackParamList, T>;
};

export const AuthStack = createStackNavigator<AuthStackParamList>();

export const AuthRoute = () => {
  return (
    <NavigationContainer>
      <AuthStack.Navigator initialRouteName="Login">
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
        <AuthStack.Screen
          name="ForgottenPassword"
          component={ForgottenPasswordScreen}
        />
      </AuthStack.Navigator>
    </NavigationContainer>
  );
};
