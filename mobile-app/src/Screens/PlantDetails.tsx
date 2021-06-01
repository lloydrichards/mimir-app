import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {PlantsNavProps, PlantsStackParamList} from 'src/Routes/plantStack';
import Center from 'src/Components/Molecule-UI/Center';

interface Props {
  route: RouteProp<PlantsStackParamList, 'PlantDetails'>;
  navigation: StackNavigationProp<PlantsStackParamList, 'PlantDetails'>;
}

const PlantDetails = ({navigation, route}: PlantsNavProps<'PlantDetails'>) => {
  return (
    <Center>
      <Text>Plant Details</Text>
      <Button mode="contained" onPress={() => navigation.navigate('AddPlant')}>
        Edit Plant
      </Button>
    </Center>
  );
};

export default PlantDetails;

const styles = StyleSheet.create({});
