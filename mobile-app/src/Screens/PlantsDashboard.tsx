import {PlantDetailProps, PlantType} from '@mimir/PlantType';
import * as React from 'react';
import {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Button, Modal, Portal, Provider, Text} from 'react-native-paper';
import {useAuth} from 'src/Components/Auth/Auth';
import Center from 'src/Components/Molecule-UI/Center';
import PlantCard from 'src/Components/Organism-Cards/PlantCard';
import PlantForm from 'src/Components/Organism-Forms/PlantForm';
import {PlantsNavProps} from 'src/Routes/plantStack';

const PlantsDashboard = ({navigation, route}: PlantsNavProps<'Plants'>) => {
  const {userDoc, plantDocs} = useAuth();

  return (
    <View style={styles.container}>
      <FlatList
        numColumns={2}
        data={plantDocs.sort((a, b) =>
          a.nickname.localeCompare(b.nickname, undefined, {
            numeric: true,
            sensitivity: 'base',
          }),
        )}
        renderItem={({item}) => (
          <PlantCard
            data={item}
            navigateTo={plant => navigation.navigate('PlantDetails', {plant})}
          />
        )}
      />
      <Button mode="contained" onPress={() => navigation.navigate('AddPlant')}>
        Add Plant
      </Button>
    </View>
  );
};

export default PlantsDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    justifyContent: 'center',
  },
});
