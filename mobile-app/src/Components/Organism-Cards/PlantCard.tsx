import {PlantDetailProps, PlantType} from '@mimir/PlantType';
import {SpaceType} from '@mimir/SpaceType';
import {firebase} from '@react-native-firebase/firestore';
import {
  COLOUR_COTTON_CANDY,
  COLOUR_DARK,
  COLOUR_LIGHT,
  COLOUR_MINTED,
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
import {PlantTypesMap} from '../Molecule-Data/PlantTypesMap';
import {RoomTypeMap} from '../Molecule-Data/RoomTypeMap';

interface Props {
  data: PlantDetailProps;
  navigateTo: (plant: PlantType) => void;
}
const PlantCard: React.FC<Props> = ({navigateTo, data}) => {
  const {plant, spaceDocs} = useAuth();
  const currentSpace = spaceDocs.find(s =>
    s.config?.plant_ids.includes(data.id),
  );
  const alreadyWatered = useMemo(
    () => data.watering?.timestamp.toDate().getDate() === new Date().getDate(),
    [data.watering],
  );
  if (!currentSpace)
    return (
      <View style={styles.card}>
        <Text>{data.nickname}</Text>
        <Text>({data.species.id})</Text>
        <ActivityIndicator />
      </View>
    );
  const spaceType: SpaceType = {
    id: currentSpace.id,
    light_direction: currentSpace?.light_direction,
    name: currentSpace.name,
    room_type: currentSpace.room_type,
  };
  if (currentSpace.picture) {
    spaceType.thumb = currentSpace.picture.thumb;
  }
  const plantType: PlantType = {
    id: data.id,
    nickname: data.nickname,
    botanical_name: data.species.id,
    type: data.species.type,
  };
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => navigateTo(plantType)}>
        <View style={styles.titleCard}>
          {PlantTypesMap.find(i => i.id === data.species.type)?.icon({
            background: COLOUR_MINTED,
          })}
          <Text style={styles.title}>{data.nickname}</Text>
        </View>
        <Text style={styles.subtitle}>({data.species.id})</Text>
      </TouchableOpacity>
      <View style={styles.room}>
        {RoomTypeMap.find(i => i.id == data.space?.room_type)?.icon({
          background: COLOUR_COTTON_CANDY,
        })}
        <Text style={styles.room_name}>{data.space?.name}</Text>
      </View>

      {alreadyWatered && data.watering ? (
        <Text>Watered: {timeSince(data.watering.timestamp.toDate())}</Text>
      ) : (
        <Button
          onPress={() =>
            plant.water(spaceType, plantType, {
              timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
              fertilizer: false,
            })
          }>
          Add Watering
        </Button>
      )}
    </View>
  );
};

export default PlantCard;

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
  titleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 8,
    fontSize: 12,
    fontStyle: 'italic',
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
    paddingHorizontal: 8,
    fontSize: 12,
    fontStyle: 'italic',
  },
  room_name: {
    marginLeft: 8,
    fontSize: 16,
    color: COLOUR_DARK,
  },
});
