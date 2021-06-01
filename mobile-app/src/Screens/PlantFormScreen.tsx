import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {PlantsNavProps, PlantsStackParamList} from 'src/Routes/plantStack';
import Center from 'src/Components/Molecule-UI/Center';
import PlantForm from 'src/Components/Organism-Forms/PlantForm';

interface Props {
  route: RouteProp<PlantsStackParamList, 'PlantDetails'>;
  navigation: StackNavigationProp<PlantsStackParamList, 'PlantDetails'>;
}

export const PlantFormScreen = ({navigation,route}: PlantsNavProps<'PlantDetails'>) => {
  return (
    <Center>
      <PlantForm />
    </Center>
  );
};

const styles = StyleSheet.create({});
