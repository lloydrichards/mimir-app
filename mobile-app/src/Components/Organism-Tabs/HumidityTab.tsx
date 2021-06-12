import {PlantType} from '@mimir/PlantType';
import {SpaceType} from '@mimir/SpaceType';
import {COLOUR_SKY} from '@styles/Colours';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Center from '../Molecule-UI/Center';
import {PlantDetailTabProps} from './PlantDetailTab';


const HumidityTab = ({navigation,route}: PlantDetailTabProps<'Hum'>) => {
  return (
    <View style={{flex: 1, backgroundColor: COLOUR_SKY}}>
      <Center>
        <Text>Humidity</Text>
      </Center>
    </View>
  );
};

export default HumidityTab;

const styles = StyleSheet.create({});
