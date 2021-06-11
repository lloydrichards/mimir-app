import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useAuth} from 'src/Components/Auth/Auth';
import Center from 'src/Components/Molecule-UI/Center';
import {PlantDetailTab} from 'src/Components/Organism-Tabs/PlantDetailTab';
import {PlantsNavProps} from 'src/Routes/plantStack';

const PlantDetails = ({navigation, route}: PlantsNavProps<'PlantDetails'>) => {
  const {plantDocs} = useAuth();
  const data = plantDocs.find(i => i.id === route.params.plant.id);

  return (
    <Center>
      <Text style={{fontSize: 22, fontWeight: 'bold'}}>
        {data?.nickname} Details
      </Text>
      <View style={{flex: 1, width: '100%', backgroundColor: 'tomato'}}>
        <PlantDetailTab />
      </View>
    </Center>
  );
};

export default PlantDetails;

const styles = StyleSheet.create({});
