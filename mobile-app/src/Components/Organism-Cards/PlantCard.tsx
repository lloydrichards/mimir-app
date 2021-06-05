import {PlantDetailProps, PlantType} from '@mimir/PlantType';
import {SpaceType} from '@mimir/SpaceType';
import {firebase} from '@react-native-firebase/firestore';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper';
import {timestamp} from 'src/Services/firebase';
import {useAuth} from '../Auth/Auth';

interface Props {
  plant: PlantDetailProps;
  navigateTo: (plant: PlantType) => void;
}
const PlantCard: React.FC<Props> = ({navigateTo, plant}) => {
  const {addWatering, spaceDocs} = useAuth();
  const currentSpace = spaceDocs.find(s =>
    s.config?.plant_ids.includes(plant.id),
  );
  if (!currentSpace)
    return (
      <View>
        <Text>{plant.nickname}</Text>
        <Text>({plant.species.id})</Text>
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
    id: plant.id,
    nickname: plant.nickname,
    botanical_name: plant.species.id,
    type: plant.species.type,
  };
  return (
    <View>
      <Text>{plant.nickname}</Text>
      <Text>({plant.species.id})</Text>

      <Button
        onPress={() =>
          addWatering(spaceType, plantType, {
            date_created: firebase.firestore.Timestamp.fromDate(new Date()),
            fertilizer: false,
          })
        }>
        Add Watering
      </Button>
      <Button onPress={() => navigateTo(plantType)}>More Details</Button>
    </View>
  );
};

export default PlantCard;

const styles = StyleSheet.create({});
