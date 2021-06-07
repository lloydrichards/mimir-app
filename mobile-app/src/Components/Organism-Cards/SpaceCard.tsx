import {PlantDetailProps, PlantType} from '@mimir/PlantType';
import {SpaceDetailProps, SpaceType} from '@mimir/SpaceType';
import {firebase} from '@react-native-firebase/firestore';
import {
  COLOUR_DARK,
  COLOUR_LIGHT,
  COLOUR_SECONDARY,
  COLOUR_SKY,
  COLOUR_SUBTLE,
} from '@styles/Colours';
import {style} from 'd3-selection';
import React, {useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper';
import {timestamp} from 'src/Services/firebase';
import {useAuth} from '../Auth/Auth';
import {formatDate, timeSince} from '../Helpers/formatUtil';
import {RoomTypeMap} from '../Molecule-Data/RoomTypeMap';

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

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => navigateTo(spaceType)}>
        <View style={styles.room}>
          {RoomTypeMap.find(i => i.id == data.room_type)?.icon({background:COLOUR_SKY})}
          <Text style={styles.title}>{data.name}</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.subtitle}>
        ({data.location.city},{data.location.country})
      </Text>
      <Text>Plants: {data.config?.plants.length || 0}</Text>
    </View>
  );
};

export default SpaceCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'column',
    margin: 4,
    padding: 4,
    borderRadius: 16,
    borderColor: COLOUR_SUBTLE,
    borderWidth: 1,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOUR_LIGHT,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
  },
  room: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
