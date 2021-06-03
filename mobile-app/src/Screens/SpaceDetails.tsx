import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {PlantsNavProps, PlantsStackParamList} from 'src/Routes/plantStack';
import {SpaceNavProps} from 'src/Routes/spaceStack';
import Center from 'src/Components/Molecule-UI/Center';
import {useAuth} from 'src/Components/Auth/Auth';
import {useMemo} from 'react';

const SpaceDetails = ({navigation, route}: SpaceNavProps<'SpaceDetails'>) => {
  const {spaceDocs} = useAuth();
  const details = useMemo(
    () => spaceDocs.find(s => s.id === route.params.space.id),
    [spaceDocs],
  );
  return (
    <Center>
      <Text>Space Details for {details?.name}</Text>
      <Button mode="contained" onPress={() => navigation.navigate('AddSpace')}>
        Edit Space
      </Button>
    </Center>
  );
};

export default SpaceDetails;

const styles = StyleSheet.create({});
