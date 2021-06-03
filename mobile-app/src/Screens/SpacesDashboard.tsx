import {SpaceType} from '@mimir/SpaceType';
import * as React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useAuth} from 'src/Components/Auth/Auth';
import Center from 'src/Components/Molecule-UI/Center';
import {SpaceNavProps} from 'src/Routes/spaceStack';

const SpacesDashboard = ({navigation, route}: SpaceNavProps<'Spaces'>) => {
  const {spaceDocs} = useAuth();
  return (
    <Center>
      <Text>Spaces Dashboard</Text>
      <FlatList
        numColumns={2}
        data={spaceDocs}
        renderItem={({item}) => {
          const space: SpaceType = {
            id: item.id,
            name: item.name,
            light_direction: item.light_direction,
            room_type: item.room_type,
            thumb: item.picture?.thumb,
          };
          return (
            <Button
              onPress={() => navigation.navigate('SpaceDetails', {space})}>
              {item.name}
            </Button>
          );
        }}
      />
      <Button mode="contained" onPress={() => navigation.navigate('AddSpace')}>
        Add Space
      </Button>
    </Center>
  );
};

export default SpacesDashboard;

const styles = StyleSheet.create({});
