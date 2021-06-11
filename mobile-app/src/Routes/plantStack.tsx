import { RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp
} from '@react-navigation/stack';
import React from 'react';
import SignOut from 'src/Components/Auth/SignOut';
import PlantsDashboard from 'src/Screens/Plants/PlantsDashboard';
import { addPlantRoutes, PlantParamList } from './addPlantRoutes';

export type PlantsStackParamList = {
  Plants: undefined;
} & PlantParamList;

export type PlantsNavProps<T extends keyof PlantsStackParamList> = {
  route: RouteProp<PlantsStackParamList, T>;
  navigation: StackNavigationProp<PlantsStackParamList, T>;
};

export const PlantsStack = createStackNavigator<PlantsStackParamList>();

export const PlantsRoute = () => {
  return (
    <PlantsStack.Navigator initialRouteName="Plants">
      <PlantsStack.Screen
        name="Plants"
        options={{headerTitleAlign: 'center', headerRight: () => <SignOut />}}
        component={PlantsDashboard}
      />
      {addPlantRoutes(PlantsStack as any)}
    </PlantsStack.Navigator>
  );
};
