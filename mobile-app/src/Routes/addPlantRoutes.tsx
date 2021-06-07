import {PlantType, PlantProps} from '@mimir/PlantType';
import {TypedNavigator, StackNavigationState} from '@react-navigation/native';
import {StackNavigationOptions} from '@react-navigation/stack';
import {StackNavigationEventMap} from '@react-navigation/stack/lib/typescript/src/types';
import React from 'react';
import PlantDetails from 'src/Screens/PlantDetails';
import {PlantFormScreen} from 'src/Screens/PlantFormScreen';
import {PlantsStackParamList} from './plantStack';
import {SpaceStackParamList} from './spaceStack';

export type PlantParamList = {
  PlantDetails: {plant: PlantType};
  EditPlant: {data: PlantProps};
  AddPlant: undefined;
};

export const addPlantRoutes = (
  stack: TypedNavigator<
    PlantsStackParamList | SpaceStackParamList,
    StackNavigationState<Record<string, object | undefined>>,
    StackNavigationOptions,
    any,
    any
  >,
) => {
  return (
    <>
      <stack.Screen
        name="PlantDetails"
        options={({route}) => ({
          headerTitleAlign: 'center',
          headerTitle: route.params.plant.nickname
            ? `${route.params.plant.nickname} (${route.params.plant.botanical_name})`
            : route.params.plant.botanical_name,
        })}
        component={PlantDetails}
      />
      <stack.Screen
        name="AddPlant"
        options={{headerTitleAlign: 'center'}}
        component={PlantFormScreen}
      />
      <stack.Screen
        name="EditPlant"
        options={{headerTitleAlign: 'center'}}
        component={PlantFormScreen}
      />
    </>
  );
};
