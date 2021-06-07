import {SpaceType} from '@mimir/SpaceType';
import * as React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useAuth} from 'src/Components/Auth/Auth';
import Center from 'src/Components/Molecule-UI/Center';
import SpaceCard from 'src/Components/Organism-Cards/SpaceCard';
import {SpaceNavProps} from 'src/Routes/spaceStack';

const SpacesDashboard = ({navigation, route}: SpaceNavProps<'Spaces'>) => {
  const {spaceDocs} = useAuth();
  return (
    <View style={styles.container}>
      <Text>Spaces Dashboard</Text>
      <FlatList
        numColumns={2}
        data={spaceDocs.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: 'base',
          }),
        )}
        renderItem={({item}) => (
          <SpaceCard
            data={item}
            navigateTo={space => navigation.navigate('SpaceDetails', {space})}
          />
        )}
      />
      <Button mode="contained" onPress={() => navigation.navigate('AddSpace')}>
        Add Space
      </Button>
    </View>
  );
};

export default SpacesDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    justifyContent: 'center',
  },
});
