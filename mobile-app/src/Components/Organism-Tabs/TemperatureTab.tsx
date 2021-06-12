import { PlantType } from '@mimir/PlantType';
import { SpaceType } from '@mimir/SpaceType';
import {COLOUR_FLUFF} from '@styles/Colours';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Center from '../Molecule-UI/Center';

interface Props {
  type: 'PLANT' | 'SPACE';
  data: PlantType | SpaceType;
}

const TemperatureTab: React.FC<Props> = () => {
  return (
    <View style={{flex: 1,backgroundColor: COLOUR_FLUFF}}>
      <Center>
        <Text>Temprature</Text>
      </Center>
    </View>
  );
};

export default TemperatureTab;

const styles = StyleSheet.create({});
