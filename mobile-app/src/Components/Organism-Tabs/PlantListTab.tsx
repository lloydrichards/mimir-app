import {COLOUR_MINTED} from '@styles/Colours';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {DataTable} from 'react-native-paper';
import {useAuth} from '../Auth/Auth';
import {PlantTypesMap} from '../Molecule-Data/PlantTypesMap';
import {SpaceDetailTabProps} from './SpaceDetailTab';

const optionsPerPage = [5];

const PlantListTab = ({navigation, route}: SpaceDetailTabProps<'Plants'>) => {
  const {spaceDocs} = useAuth();
  const [page, setPage] = React.useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]);
  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const plants = spaceDocs.find(i => i.id === route.params.space.id)?.config
    ?.plants;
  if (!plants)
    return (
      <View>
        <Text>No Plants</Text>
      </View>
    );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, plants.length);

  const currentPlants = plants.slice(from, to);
  return (
    <View style={{flex: 1, backgroundColor: COLOUR_MINTED, padding:8}}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>
            <Text style={styles.header}>Plant</Text>
          </DataTable.Title>
          <DataTable.Title>
            <Text style={styles.header}>Species</Text>
          </DataTable.Title>
          <DataTable.Title>
            <Text style={styles.header}>Type</Text>
          </DataTable.Title>
        </DataTable.Header>
        {currentPlants.map(plant => (
          <DataTable.Row
            key={plant.id}
            style={styles.row}
            onPress={() => navigation.navigate('PlantDetails', {plant})}>
            <DataTable.Cell style={styles.cell}>
              <Text>{plant.nickname}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={styles.cell}>
              <Text style={{fontStyle:"italic", flexWrap:"wrap", overflow:"visible"}}>{plant.botanical_name}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={styles.cell}>
              <Text>{PlantTypesMap.find(i => i.id === plant.type)?.field}</Text>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(plants.length / itemsPerPage)}
          onPageChange={page => setPage(page)}
          label={`${from + 1}-${to} of ${plants.length}`}
        />
      </DataTable>
    </View>
  );
};

export default PlantListTab;

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {},

  cell: {},
});
