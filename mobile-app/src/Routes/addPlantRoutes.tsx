import {PlantProps, PlantType} from '@mimir/PlantType';
import {StackNavigationState, TypedNavigator} from '@react-navigation/native';
import {StackNavigationOptions} from '@react-navigation/stack';
import React from 'react';
import {View, Text} from 'react-native';
import {Button} from 'react-native-paper';
import PlantDetails from 'src/Screens/Plants/PlantDetails';
import {PlantFormScreen} from 'src/Screens/Plants/PlantFormScreen';
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
        options={({route, navigation}) => ({
          headerTitleAlign: 'center',
          headerRight: () => (
            <View>
              <Button
                onPress={() =>
                  navigation.navigate('EditPlant', {plant: route.params.plant})
                }>
                Edit
              </Button>
            </View>
          ),
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
