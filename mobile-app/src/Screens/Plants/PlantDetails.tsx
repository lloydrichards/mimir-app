import {PlantType} from '@mimir/PlantType';
import {COLOUR_ACCENT, COLOUR_DARK} from '@styles/Colours';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Divider, Text} from 'react-native-paper';
import {BlankFaceIcon} from 'src/Components/Atom-Icons/Face/SmallFaceIcons';
import {DiseaseNoneIcon} from 'src/Components/Atom-Icons/Status/SmallDiseaseIcon';
import {HumidityIcon} from 'src/Components/Atom-Icons/Status/SmallHumidityIcons';
import {LightIcon} from 'src/Components/Atom-Icons/Status/SmallLightIcons';
import {PestNoneIcon} from 'src/Components/Atom-Icons/Status/SmallPestIcons';
import {TemperatureIcon} from 'src/Components/Atom-Icons/Status/SmallTemperatureIcon';
import {WateringIcon} from 'src/Components/Atom-Icons/Status/SmallWateringIcons';
import {useAuth} from 'src/Components/Auth/Auth';
import {MoodMap} from 'src/Components/Molecule-Data/SmallMoodMap';
import Center from 'src/Components/Molecule-UI/Center';
import FieldValue from 'src/Components/Molecule/FieldValue';
import {PlantDetailTab} from 'src/Components/Organism-Tabs/PlantDetailTab';
import {PlantsNavProps} from 'src/Routes/plantStack';

const PlantDetails = ({navigation, route}: PlantsNavProps<'PlantDetails'>) => {
  const {plantDocs} = useAuth();
  const data = plantDocs.find(i => i.id === route.params.plant.id);

  if (!data)
    return (
      <View>
        <Text>No Data!</Text>
      </View>
    );
  const currentMood = data?.config
    ? MoodMap({happiness: data?.config.happiness, health: data.config.health})
    : undefined;

  const plantType: PlantType = {
    id: data.id,
    nickname: data.nickname,
    botanical_name: data.species.id,
    type: data.species.type,
  };

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
          {data?.nickname} Details
        </Text>
        <View style={{flex: 1}}>
          <FieldValue title="Species">
            <Text>{data.species.id}</Text>
          </FieldValue>
          <FieldValue title="Type">
            <Text>{data.species.type}</Text>
          </FieldValue>
          <FieldValue title="Origin">
            <Text>{data.origin}</Text>
          </FieldValue>
          {data.parent && (
            <FieldValue title="Parent">
              <Button onPress={() => navigation.navigate('Plants')}>
                {data.parent.name}
              </Button>
            </FieldValue>
          )}
          <Divider style={{marginVertical: 8}} />

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
        </View>
      </View>
      <View style={{flex: 1, width: '100%'}}>
        <PlantDetailTab plant={plantType} />
      </View>
    </Center>
  );
};

export default PlantDetails;

const styles = StyleSheet.create({
  status: {
    marginTop: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
