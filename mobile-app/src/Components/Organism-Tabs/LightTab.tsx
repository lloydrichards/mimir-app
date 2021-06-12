import {PlantType} from '@mimir/PlantType';
import {SpaceType} from '@mimir/SpaceType';
import {COLOUR_SUNSHINE} from '@styles/Colours';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Center from '../Molecule-UI/Center';
import {PlantDetailTabProps} from './PlantDetailTab';

const LightTab = ({navigation, route}: PlantDetailTabProps<'Light'>) => {
  return (
    <View style={{flex: 1, backgroundColor: COLOUR_SUNSHINE}}>
      <Center>
        <Text>Light</Text>
      </Center>
    </View>
  );
};

export default LightTab;

const styles = StyleSheet.create({});
