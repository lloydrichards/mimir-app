import {PlantProps, PlantType} from '@mimir/PlantType';
import {RouteProp} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React from 'react';
import SignOut from 'src/Components/Auth/SignOut';
import PlantDetails from 'src/Screens/PlantDetails';
import {PlantFormScreen} from 'src/Screens/PlantFormScreen';
import PlantsDashboard from 'src/Screens/PlantsDashboard';

export type PlantsStackParamList = {
  Plants: undefined;
  PlantDetails: {plant: PlantType};
  EditPlant: {data: PlantProps};
  AddPlant: undefined;
};

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
      <PlantsStack.Screen
        name="PlantDetails"
        options={({route}) => ({
          headerTitleAlign: 'center',
          headerTitle: route.params.plant.nickname
            ? `${route.params.plant.nickname} (${route.params.plant.botanical_name})`
            : route.params.plant.botanical_name,
        })}
        component={PlantDetails}
      />
      <PlantsStack.Screen
        name="AddPlant"
        options={{headerTitleAlign: 'center'}}
        component={PlantFormScreen}
      />
      <PlantsStack.Screen
        name="EditPlant"
        options={{headerTitleAlign: 'center'}}
        component={PlantFormScreen}
      />
    </PlantsStack.Navigator>
  );
};
