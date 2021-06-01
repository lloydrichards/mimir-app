import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';
import Center from 'src/Components/Molecule-UI/Center';
import {PlantsNavProps} from 'src/Routes/plantStack';

const PlantsDashboard = ({navigation, route}: PlantsNavProps<'Plants'>) => {
  return (
    <Center>
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
    </Center>
  );
};

export default PlantsDashboard;

const styles = StyleSheet.create({});
