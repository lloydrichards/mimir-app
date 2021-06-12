import * as React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Button, Divider, Text} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {PlantsNavProps, PlantsStackParamList} from 'src/Routes/plantStack';
import {SpaceNavProps} from 'src/Routes/spaceStack';
import Center from 'src/Components/Molecule-UI/Center';
import {useAuth} from 'src/Components/Auth/Auth';
import {useMemo} from 'react';
import {SpaceDetailTab} from 'src/Components/Organism-Tabs/SpaceDetailTab';
import {SpaceType} from '@mimir/SpaceType';
import FieldValue from 'src/Components/Molecule/FieldValue';
import {TemperatureIcon} from 'src/Components/Atom-Icons/Status/SmallTemperatureIcon';
import {HumidityIcon} from 'src/Components/Atom-Icons/Status/SmallHumidityIcons';
import {LightIcon} from 'src/Components/Atom-Icons/Status/SmallLightIcons';
import {COLOUR_ACCENT, COLOUR_SECONDARY, COLOUR_SUBTLE} from '@styles/Colours';

const SpaceDetails = ({navigation, route}: SpaceNavProps<'SpaceDetails'>) => {
  const {spaceDocs} = useAuth();
  const data = useMemo(
    () => spaceDocs.find(s => s.id === route.params.space.id),
    [spaceDocs],
  );
  if (!data)
    return (
      <View>
        <ActivityIndicator />
      </View>
    );

  const spaceType: SpaceType = {
    id: data.id,
    name: data.name,
    room_type: data.room_type,
    light_direction: data.light_direction,
  };
  if (data.picture) {
    spaceType.thumb = data.picture.thumb;
  }

  return (
    <Center>
      <View
        style={{
          flexDirection: 'row',
          minHeight: 80,
          paddingHorizontal: 8,
          marginVertical: 16,
        }}>
        <Text style={{flex: 1, fontSize: 22, fontWeight: 'bold'}}>
          {data?.name} Details
        </Text>
        <View style={{flex: 1}}>
          <FieldValue title="Room type">
            <Text>{data.room_type}</Text>
          </FieldValue>
          <FieldValue title="Exposure">
            <Text>{data.exposure}</Text>
          </FieldValue>
          <FieldValue title="Light Direction">
            <Text>
              {data.light_direction.reduce(
                (acc, cur) => acc.concat(`${cur}, `),
                '',
              )}
            </Text>
          </FieldValue>
          <Divider style={{marginVertical: 8}} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: data.aggs?.env.reading_total
                ? COLOUR_SECONDARY
                : COLOUR_ACCENT,
            }}>
            Current
          </Text>
          <FieldValue icon={TemperatureIcon} title="Temp"></FieldValue>
          <FieldValue icon={HumidityIcon} title="Hum"></FieldValue>
          <FieldValue icon={LightIcon} title="Light"></FieldValue>
        </View>
      </View>
      <View style={{flex: 1, width: '100%'}}>
        <SpaceDetailTab space={spaceType} />
      </View>
    </Center>
  );
};

export default SpaceDetails;

const styles = StyleSheet.create({});
