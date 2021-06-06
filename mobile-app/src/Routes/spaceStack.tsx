import {SpaceProps, SpaceType} from '@mimir/SpaceType';
import {RouteProp} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React from 'react';
import SignOut from 'src/Components/Auth/SignOut';
import SpaceDetails from 'src/Screens/SpaceDetails';
import {SpaceFormScreen} from 'src/Screens/SpaceFormScreen';
import SpacesDashboard from 'src/Screens/SpacesDashboard';

export type SpaceStackParamList = {
  Spaces: undefined;
  SpaceDetails: {space: SpaceType};
  AddSpace: undefined;
  EditSpace: {data: SpaceProps};
  AddDevice: undefined;
  EditDevice: {data: SpaceProps};
};

export type SpaceNavProps<T extends keyof SpaceStackParamList> = {
  route: RouteProp<SpaceStackParamList, T>;
  navigation: StackNavigationProp<SpaceStackParamList, T>;
};

export const SpaceStack = createStackNavigator<SpaceStackParamList>();

export const SpaceRoute = () => {
  return (
    <SpaceStack.Navigator initialRouteName="Spaces">
      <SpaceStack.Screen
        name="Spaces"
        options={{headerTitleAlign: 'center', headerRight: () => <SignOut />}}
        component={SpacesDashboard}
      />
      <SpaceStack.Screen
        options={({route}) => ({
          headerTitleAlign: 'center',
          headerTitle: route.params.space.name,
        })}
        name="SpaceDetails"
        component={SpaceDetails}
      />
      <SpaceStack.Screen name="AddSpace" component={SpaceFormScreen} />
      <SpaceStack.Screen name="EditSpace" component={SpaceFormScreen} />
      <SpaceStack.Screen name="AddDevice" component={SpaceFormScreen} />
      <SpaceStack.Screen name="EditDevice" component={SpaceFormScreen} />
    </SpaceStack.Navigator>
  );
};
