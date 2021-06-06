import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {PlantsNavProps, PlantsStackParamList} from 'src/Routes/plantStack';
import {SpaceNavProps} from 'src/Routes/spaceStack';
import Center from 'src/Components/Molecule-UI/Center';
import SpaceForm from 'src/Components/Organism-Forms/SpaceForm';
import DeviceForm from 'src/Components/Organism-Forms/DeviceForm';

export const SpaceFormScreen = ({
  navigation,
  route,
}: SpaceNavProps<'SpaceDetails'>) => {
  return (
    <Center>
      <DeviceForm onComplete={space => navigation.navigate('SpaceDetails', {space})} />
    </Center>
  );
};

const styles = StyleSheet.create({});
