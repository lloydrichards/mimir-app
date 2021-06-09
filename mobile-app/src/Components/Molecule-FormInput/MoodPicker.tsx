import {PlantType} from '@mimir/PlantType';
import {SpaceType} from '@mimir/SpaceType';
import React, {useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import IconSwitch from '../Atom-Inputs/IconSwitch';
import {useAuth} from '../Auth/Auth';
import {MediumMoodMap} from '../Molecule-Data/MediumMoodMap';

type Props = {
  plant: PlantType;
  space: SpaceType;
  onPress: () => void;
  current: {happiness: number; health: number};
};

const MoodPicker: React.FC<Props> = ({plant, space, current, onPress}) => {
  const [loading, setLoading] = useState(false);
  const {
    plant: {mood},
  } = useAuth();
  const currentMood = MediumMoodMap(current);

  const handleOnPress = async (value: {happiness: number; health: number}) => {
    if (MediumMoodMap(value).id === currentMood.id) return onPress();
    setLoading(true);
    try {
      await mood(plant, space, value);
      onPress();
    } catch (err) {
      console.log(err);
      Alert.alert(err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <IconSwitch
            disabled={loading}
            icon={MediumMoodMap({happiness: 1, health: 0}).icon()}
            onPress={() => handleOnPress({happiness: 1, health: 0})}
            selected={
              MediumMoodMap({happiness: 1, health: 0}).id === currentMood.id
            }
          />
          <IconSwitch
            disabled={loading}
            icon={MediumMoodMap({happiness: 0.5, health: 0}).icon()}
            onPress={() => handleOnPress({happiness: 0.5, health: 0})}
            selected={
              MediumMoodMap({happiness: 0.5, health: 0}).id === currentMood.id
            }
          />
          <IconSwitch
            disabled={loading}
            icon={MediumMoodMap({happiness: 0, health: 0}).icon()}
            onPress={() => handleOnPress({happiness: 0, health: 0})}
            selected={
              MediumMoodMap({happiness: 0, health: 0}).id === currentMood.id
            }
          />
        </View>
        <View>
          <IconSwitch
            disabled={loading}
            icon={MediumMoodMap({happiness: 1, health: 0.5}).icon()}
            onPress={() => handleOnPress({happiness: 1, health: 0.5})}
            selected={
              MediumMoodMap({happiness: 1, health: 0.5}).id === currentMood.id
            }
          />
          <IconSwitch
            disabled={loading}
            icon={MediumMoodMap({happiness: 0.5, health: 0.5}).icon()}
            onPress={() => handleOnPress({happiness: 0.5, health: 0.5})}
            selected={
              MediumMoodMap({happiness: 0.5, health: 0.5}).id === currentMood.id
            }
          />
          <IconSwitch
            disabled={loading}
            icon={MediumMoodMap({happiness: 0, health: 0.5}).icon()}
            onPress={() => handleOnPress({happiness: 0, health: 0.5})}
            selected={
              MediumMoodMap({happiness: 0, health: 0.5}).id === currentMood.id
            }
          />
        </View>
        <View>
          <IconSwitch
            disabled={loading}
            icon={MediumMoodMap({happiness: 1, health: 1}).icon()}
            onPress={() => handleOnPress({happiness: 1, health: 1})}
            selected={
              MediumMoodMap({happiness: 1, health: 1}).id === currentMood.id
            }
          />
          <IconSwitch
            disabled={loading}
            icon={MediumMoodMap({happiness: 0.5, health: 1}).icon()}
            onPress={() => handleOnPress({happiness: 0.5, health: 1})}
            selected={
              MediumMoodMap({happiness: 0.5, health: 1}).id === currentMood.id
            }
          />
          <IconSwitch
            disabled={loading}
            icon={MediumMoodMap({happiness: 0, health: 1}).icon()}
            onPress={() => handleOnPress({happiness: 0, health: 1})}
            selected={
              MediumMoodMap({happiness: 0, health: 1}).id === currentMood.id
            }
          />
        </View>
      </View>
    </View>
  );
};

export default MoodPicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {flexDirection: 'row'},
});
