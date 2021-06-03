import * as React from 'react';
import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Modal, Portal, Provider, Text} from 'react-native-paper';
import {useAuth} from 'src/Components/Auth/Auth';
import Center from 'src/Components/Molecule-UI/Center';
import PlantForm from 'src/Components/Organism-Forms/PlantForm';
import {PlantsNavProps} from 'src/Routes/plantStack';

const PlantsDashboard = ({navigation, route}: PlantsNavProps<'Plants'>) => {
  const {userDoc} = useAuth();
  return (
    <Center>
      <Text style={{fontSize: 20, marginVertical: 16}}>
        Welcome, {userDoc?.username}!
      </Text>
      <Text>Plant Dashboard</Text>
      <Button
        onPress={() =>
          navigation.navigate('PlantDetails', {
            plant: {
              id: '1',
              botanical_name: 'A. meliffera',
              nickname: 'Bob',
              type: 'BAMBOO',
            },
          })
        }>
        To Plant
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('AddPlant')}>
        Add Plant
      </Button>
    </Center>
  );
};

export default PlantsDashboard;

const styles = StyleSheet.create({});
