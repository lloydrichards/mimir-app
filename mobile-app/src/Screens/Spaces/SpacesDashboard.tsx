import { COLOUR_SECONDARY } from '@styles/Colours';
import { ScreenStyle } from '@styles/GlobalStyle';
import * as React from 'react';
import { FlatList, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from 'src/Components/Auth/Auth';
import SpaceCard from 'src/Components/Organism-Cards/SpaceCard';
import { SpaceNavProps } from 'src/Routes/spaceStack';

const SpacesDashboard = ({navigation, route}: SpaceNavProps<'Spaces'>) => {
  const {spaceDocs} = useAuth();
  return (
    <View style={ScreenStyle.container}>
      <Button
        color={COLOUR_SECONDARY}
        mode="contained"
        onPress={() => navigation.navigate('AddSpace')}>
        Add Space
      </Button>
      <FlatList
        numColumns={2}
        data={spaceDocs.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: 'base',
          }),
        )}
        renderItem={({item}) => (
          <SpaceCard
            data={item}
            navigateTo={space => navigation.navigate('SpaceDetails', {space})}
          />
        )}
      />
    </View>
  );
};

export default SpacesDashboard;
