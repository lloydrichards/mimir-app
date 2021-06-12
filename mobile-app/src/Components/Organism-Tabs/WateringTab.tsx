import {PlantType} from '@mimir/PlantType';
import {SpaceType} from '@mimir/SpaceType';
import {COLOUR_MINTED} from '@styles/Colours';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Center from '../Molecule-UI/Center';

interface Props {
  type: 'PLANT' | 'SPACE';
  data: PlantType | SpaceType;
}

const WateringTab: React.FC<Props> = () => (
  <View style={{flex: 1, backgroundColor: COLOUR_MINTED}}>
    <Center>
      <Text>Watering</Text>
    </Center>
  </View>
);

export default WateringTab;

const styles = StyleSheet.create({});
