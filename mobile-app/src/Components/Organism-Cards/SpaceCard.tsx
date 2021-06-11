import {PlantDetailProps, PlantType, PlantTypes} from '@mimir/PlantType';
import {SpaceDetailProps, SpaceType} from '@mimir/SpaceType';
import {firebase} from '@react-native-firebase/firestore';
import {
  COLOUR_DARK,
  COLOUR_LIGHT,
  COLOUR_MINTED,
  COLOUR_SECONDARY,
  COLOUR_SKY,
  COLOUR_SUBTLE,
} from '@styles/Colours';
import {SurfaceStyles} from '@styles/GlobalStyle';
import {style} from 'd3-selection';
import React, {useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper';
import {timestamp} from 'src/Services/firebase';
import {UnknownPlantIcon} from '../Atom-Icons/PlantTypes/SmallPlantIcons';
import { HumidityIcon } from '../Atom-Icons/Status/SmallHumidityIcons';
import { LightIcon } from '../Atom-Icons/Status/SmallLightIcons';
import {TemperatureIcon} from '../Atom-Icons/Status/SmallTemperatureIcon';
import {useAuth} from '../Auth/Auth';
import {formatDate, timeSince} from '../Helpers/formatUtil';
import {PlantTypesMap} from '../Molecule-Data/PlantTypesMap';
import {RoomTypeMap} from '../Molecule-Data/RoomTypeMap';
import BadgedIcon from '../Molecule/BadgedIcon';
import FieldValue from '../Molecule/FieldValue';

interface Props {
  data: SpaceDetailProps;
  navigateTo: (space: SpaceType) => void;
}
const SpaceCard: React.FC<Props> = ({navigateTo, data}) => {
  const spaceType: SpaceType = {
    id: data.id,
    light_direction: data.light_direction,
    name: data.name,
    room_type: data.room_type,
  };

  const RoomType = RoomTypeMap.find(i => i.id === data.room_type);
  const flatPlants = Object.entries(
    data.config?.plants.reduce((acc, cur) => {
      if (cur.type in acc) {
        acc[cur.type]++;
      } else {
        acc[cur.type] = 1;
      }
      return acc;
    }, {} as {[key in PlantTypes]: number}) || {},
  );

  return (
    <View style={SurfaceStyles.card}>
      <TouchableOpacity onPress={() => navigateTo(spaceType)}>
        <View style={SurfaceStyles.titleCard}>
          {RoomType?.icon({
            background: RoomType.colour || COLOUR_MINTED,
          })}
          <Text style={SurfaceStyles.title}>{data.name}</Text>
        </View>
        <Text style={SurfaceStyles.subtitle}>
          ({data.location.city}, {data.location.country})
        </Text>
      </TouchableOpacity>
      <View style={{width: '100%'}}>
        <FieldValue icon={TemperatureIcon} title="Temp"></FieldValue>
        <FieldValue icon={HumidityIcon} title="Hum"></FieldValue>
        <FieldValue icon={LightIcon} title="Light"></FieldValue>
        <Text style={styles.plant_total}>
          Plants: {data.config?.plants.length || 0}
        </Text>
        <View style={styles.plants}>
          {data.config &&
            flatPlants.map(([type, count]) => (
              <BadgedIcon
                key={type}
                colour={COLOUR_MINTED}
                disabled={count === 1}
                icon={
                  PlantTypesMap.find(i => i.id === type)?.icon ||
                  UnknownPlantIcon
                }
                content={count}
              />
            ))}
        </View>
      </View>
    </View>
  );
};

export default SpaceCard;

const styles = StyleSheet.create({
  plants: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    flexShrink: 0,
  },

  plant_total: {
    marginLeft: 8,
    fontSize: 14,
    color: COLOUR_DARK,
  },
});
