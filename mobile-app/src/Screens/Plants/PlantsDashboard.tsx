import {COLOUR_SECONDARY} from '@styles/Colours';
import {ScreenStyle} from '@styles/GlobalStyle';
import * as React from 'react';
import {FlatList, View} from 'react-native';
import {Button} from 'react-native-paper';
import {useAuth} from 'src/Components/Auth/Auth';
import PlantCard from 'src/Components/Organism-Cards/PlantCard';
import {PlantsNavProps} from 'src/Routes/plantStack';

const PlantsDashboard = ({navigation, route}: PlantsNavProps<'Plants'>) => {
  const {userDoc, plantDocs} = useAuth();

  return (
    <View style={ScreenStyle.container}>
      <Button
        color={COLOUR_SECONDARY}
        mode="contained"
        onPress={() => navigation.navigate('AddPlant')}>
        Add Plant
      </Button>
      <FlatList
        numColumns={2}
        data={plantDocs.sort((a, b) =>
          a.nickname.localeCompare(b.nickname, undefined, {
            numeric: true,
            sensitivity: 'base',
          }),
        )}
        renderItem={({item}) => (
          <PlantCard
            data={item}
            navigateTo={plant => navigation.navigate('PlantDetails', {plant})}
          />
        )}
      />
    </View>
  );
};

export default PlantsDashboard;
