import {PlantDetailProps, PlantType} from '@mimir/PlantType';
import {SpaceType} from '@mimir/SpaceType';
import {firebase} from '@react-native-firebase/firestore';
import {
  COLOUR_ACCENT,
  COLOUR_COTTON_CANDY,
  COLOUR_DARK,
  COLOUR_LIGHT,
  COLOUR_MINTED,
  COLOUR_SECONDARY,
  COLOUR_SKY,
  COLOUR_SUBTLE,
} from '@styles/Colours';
import {style} from 'd3-selection';
import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper';
import {timestamp} from 'src/Services/firebase';
import {useAuth} from '../Auth/Auth';
import {formatDate, timeSince} from '../Helpers/formatUtil';
import {MoodMap} from '../Molecule-Data/SmallMoodMap';
import {PlantTypesMap} from '../Molecule-Data/PlantTypesMap';
import {RoomTypeMap} from '../Molecule-Data/RoomTypeMap';
import MoodPicker from '../Molecule-FormInput/MoodPicker';
import {BlankFaceIcon} from '../Atom-Icons/Face/SmallFaceIcons';
import {WateringIcon} from '../Atom-Icons/Status/SmallWateringIcons';
import {TemperatureIcon} from '../Atom-Icons/Status/SmallTemperatureIcon';
import {HumidityIcon} from '../Atom-Icons/Status/SmallHumidityIcons';
import {LightIcon} from '../Atom-Icons/Status/SmallLightIcons';
import {PestNoneIcon} from '../Atom-Icons/Status/SmallPestIcons';
import {DiseaseNoneIcon} from '../Atom-Icons/Status/SmallDiseaseIcon';
import {SurfaceStyles} from '@styles/GlobalStyle';

interface Props {
  data: PlantDetailProps;
  navigateTo: (plant: PlantType) => void;
}
const PlantCard: React.FC<Props> = ({navigateTo, data}) => {
  const [moodChanger, setMoodChanger] = useState(false);
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
      <View style={SurfaceStyles.card}>
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

  const currentMood = data.config
    ? MoodMap({happiness: data.config.happiness, health: data.config.health})
    : undefined;
  const currentRoom = data.space
    ? RoomTypeMap.find(i => i.id == data.space?.room_type)
    : undefined;
  return (
    <View style={SurfaceStyles.card}>
      <TouchableOpacity
        onPress={() => navigateTo(plantType)}
        onLongPress={() => setMoodChanger(!moodChanger)}>
        <View style={SurfaceStyles.titleCard}>
          {PlantTypesMap.find(i => i.id === data.species.type)?.icon({
            background: COLOUR_MINTED,
          })}
          <Text style={SurfaceStyles.title}>{data.nickname}</Text>
        </View>
        <Text style={SurfaceStyles.subtitle}>({data.species.id})</Text>
      </TouchableOpacity>
      {data.config && moodChanger ? (
        <MoodPicker
          onPress={() => setMoodChanger(false)}
          plant={plantType}
          space={spaceType}
          current={{
            happiness: data.config.happiness,
            health: data.config.health,
          }}
        />
      ) : (
        <View>
          <View style={styles.room}>
            {currentRoom?.icon({
              background: currentRoom.colour,
            })}
            <Text style={styles.room_name}>{data.space?.name}</Text>
          </View>
          {data.watering && (
            <Text style={styles.watering}>
              Watered: {timeSince(data.watering.timestamp.toDate())}
            </Text>
          )}
          <View style={styles.status}>
            {currentMood ? (
              currentMood.icon({background: 'none'})
            ) : (
              <BlankFaceIcon background="none" />
            )}
            <WateringIcon colour={COLOUR_ACCENT} background="none" />
            <TemperatureIcon colour={COLOUR_ACCENT} background="none" />
            <HumidityIcon colour={COLOUR_ACCENT} background="none" />
            <LightIcon colour={COLOUR_ACCENT} background="none" />
            <PestNoneIcon colour={COLOUR_DARK} background="none" />
            <DiseaseNoneIcon colour={COLOUR_DARK} background="none" />
          </View>

          {alreadyWatered && (
            <Button
              mode="contained"
              icon={() => (
                <WateringIcon background="none" colour={COLOUR_LIGHT} />
              )}
              color={COLOUR_SECONDARY}
              style={{margin: 8}}
              onPress={() =>
                plant.water(spaceType, plantType, {
                  timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
                  fertilizer: false,
                })
              }>
              Water Plant
            </Button>
          )}
        </View>
      )}
    </View>
  );
};

export default PlantCard;

const styles = StyleSheet.create({
  room: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  room_name: {
    marginLeft: 8,
    fontSize: 16,
    color: COLOUR_DARK,
  },
  watering: {
    marginLeft: 8,
    fontSize: 14,
    color: COLOUR_DARK,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  status: {
    marginTop: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    fontSize: 12,
    fontStyle: 'italic',
  },
});
