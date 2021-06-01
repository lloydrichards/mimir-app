import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Center from 'src/Components/Molecule-UI/Center';
import { SpaceNavProps } from 'src/Routes/spaceStack';

const SpacesDashboard = ({navigation, route}: SpaceNavProps<'Spaces'>) => {
  return (
    <Center>
      <Text>Spaces Dashboard</Text>
      <Button
        onPress={() => navigation.navigate('SpaceDetails', {spaceId: '10'})}>
        To Space
      </Button>
    </Center>
  );
};

export default SpacesDashboard;

const styles = StyleSheet.create({});
