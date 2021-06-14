import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {PlantsNavProps, PlantsStackParamList} from 'src/Routes/plantStack';
import Center from 'src/Components/Molecule-UI/Center';
import PlantForm from 'src/Components/Organism-Forms/PlantForm';
import { useLayoutEffect } from 'react';

interface Props {
  route: RouteProp<PlantsStackParamList, 'PlantDetails'>;
  navigation: StackNavigationProp<PlantsStackParamList, 'PlantDetails'>;
}

export const PlantFormScreen = ({navigation,route}: PlantsNavProps<'PlantDetails'>) => {

  useLayoutEffect(() => {
  navigation.setOptions({
    headerRight:()=><Button>Save</Button>
  })  
  }, [navigation])

  return (
    <Center>
      <PlantForm onComplete={(plant)=>navigation.navigate("PlantDetails",{plant})}/>
    </Center>
  );
};

const styles = StyleSheet.create({});
