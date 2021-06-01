import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {PlantsNavProps, PlantsStackParamList} from 'src/Routes/plantStack';
import {SpaceNavProps} from 'src/Routes/spaceStack';
import Center from 'src/Components/Molecule-UI/Center';

const SpaceDetails = ({navigation, route}: SpaceNavProps<'SpaceDetails'>) => {
  return (
    <Center>
      <Text>Space Details</Text>
    </Center>
  );
};

export default SpaceDetails;

const styles = StyleSheet.create({});
