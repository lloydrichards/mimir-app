import {PlantTypes, SpeciesType} from '@mimir/PlantType';
import {
  COLOUR_ACCENT,
  COLOUR_LIGHT,
  COLOUR_SECONDARY,
  COLOUR_SUBTLE,
} from '@styles/Colours';
import {InputStyles} from '@styles/GlobalStyle';
import algoliasearch from 'algoliasearch';
import {FieldInputProps, FieldProps, FormikErrors, useField} from 'formik';
import React from 'react';
import {useState} from 'react';
import {
  FlatList,
  NativeSyntheticEvent,
  StyleSheet,
  TextInputFocusEventData,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Searchbar, Text, TextInput} from 'react-native-paper';
import {RejectIcon, SearchIcon} from '../Atom-Icons/UI/SmallUIIcons';
import {PlantTypesMap} from '../Molecule-Data/PlantTypesMap';

type Props = {
  label: string;
} & FieldProps<any>;

const searchClient = algoliasearch(
  '8RSL939QLN',
  '6dd4cdac7e6ef3764c918f8379a0145a',
);
const index = searchClient.initIndex('SpeciesDatabase');

type SpeciesResult = {
  label: string;
  value: {
    family: string;
    genus: string;
    species: string;
    subspecies: null | string;
    cultivar: null | string;
    type: PlantTypes;
    id: string;
  };
  image?: any;
  common: Array<string>;
};
const promiseOptions = async (inputValue: string) => {
  try {
    const resp = await index.search(inputValue, {}).then(({hits}) => hits);
    const result: SpeciesResult[] = resp.slice(0, 6).map((item: any) => ({
      label: item.objectID,
      value: {
        family: item.botanical.family,
        genus: item.botanical.genus,
        species: item.botanical.species,
        subspecies: item.botanical.subspecies,
        cultivar: item.botanical.cultivar,
        type: item.type,
        id: item.objectID,
      },
      common: item.common_name,
    }));
    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const SpeciesAutoComplete: React.FC<Props> = ({label, ...props}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState('');
  const [searchResults, setSearchResults] = useState<SpeciesResult[]>([]);
  const onSelect = (item: SpeciesResult) => {
    setSelected(item.label);
    const {
      form: {setFieldValue},
      field: {name},
    } = props;
    const species: SpeciesType = {
      ...item.value,
    };
    setFieldValue(name, species);
  };

  const onChangeSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 3) {
      const result = await promiseOptions(query);
      setSearchResults(result);
    }
  };

  const {
    field,
    form: {touched, errors},
  } = props;

  const errorMsg = touched[field.name] && errors[field.name];
  return (
    <View style={InputStyles.container}>
      <Text style={{color: COLOUR_SUBTLE}}>{label}</Text>
      <Searchbar
        style={{
          borderRadius: 8,
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: COLOUR_SUBTLE,
        }}
        icon={() => <SearchIcon background="none" />}
        clearIcon={() => <RejectIcon background="none" />}
        placeholder="Search for species..."
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      {!!errorMsg && <Text style={InputStyles.errorText}>{errorMsg}</Text>}

      {searchResults.length > 0 && (
        <View
          style={{
            borderRadius: 8,
            borderColor: COLOUR_SUBTLE,
            borderWidth: 1,
            backgroundColor: COLOUR_LIGHT,
            padding: 8,
            marginTop: 8,
            height: 200,
          }}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>Results</Text>
          {searchResults.map(item => (
            <TouchableOpacity key={item.label} onPress={() => onSelect(item)}>
              <ResultItem selected={selected === item.label} item={item} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

interface ItemProps {
  item: SpeciesResult;
  selected: boolean;
}

export const ResultItem: React.FC<ItemProps> = ({item, selected}) => {
  return (
    <View
      style={{
        paddingHorizontal: 8,
        borderRadius: 4,
        flexDirection: 'row',
        paddingVertical: 2,
        backgroundColor: selected ? COLOUR_ACCENT : COLOUR_LIGHT,
      }}>
      {PlantTypesMap.find(d => d.id === item.value.type)?.icon()}
      <Text style={{marginLeft: 8, fontSize: 16}}>
        {item.common[0].replace(/(\b[a-z](?!\s))/g, x => x.toUpperCase())}
      </Text>
      <Text style={{marginLeft: 8}}>({item.label})</Text>
    </View>
  );
};
