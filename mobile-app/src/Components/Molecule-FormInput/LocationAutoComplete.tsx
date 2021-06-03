import {Location} from '@mimir/GenericType';
import {firebase} from '@react-native-firebase/firestore';
import {COLOUR_SUBTLE} from '@styles/Colours';
import {InputStyles} from '@styles/GlobalStyle';
import {FieldProps} from 'formik';
import React from 'react';
import {View} from 'react-native';
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
import {ActivityIndicator, Searchbar, Text, TextInput} from 'react-native-paper';
import {RejectIcon, SearchIcon} from '../Atom-Icons/UI/SmallUIIcons';
import SearchInput from '../Atom-Inputs/SearchInput';
import {countryLookUp} from '../Molecule-Data/CountryLookUp';

type Props = {
  label: string;
} & FieldProps<any>;

export const LocationAutoComplete: React.FC<Props> = ({label, ...props}) => {
  const {
    field,
    form: {touched, errors},
  } = props;

  const parseLocation = async (
    data: GooglePlaceData,
    detail: GooglePlaceDetail | null,
  ) => {
    const {
      form: {setFieldValue},
      field: {name},
    } = props;
    const geo = detail?.geometry.location;
    const cityRef = detail?.address_components.find(i =>
      i.types.includes('locality'),
    );
    const countryRef = detail?.address_components.find(i =>
      i.types.includes('country'),
    );
    const regionRef = countryLookUp.find(
      i => i.iso_alpha2_code === countryRef?.short_name,
    );
    const region =
      regionRef?.intermediate_region_name ||
      regionRef?.subregion_name ||
      regionRef?.region_name ||
      regionRef?.global_name ||
      'UNDEFINED';

    const location: Location = {
      city: cityRef?.long_name || 'UNDEFINED',
      country: regionRef?.country || 'UNDEFINED',
      region,
      geo: new firebase.firestore.GeoPoint(geo?.lat || 0, geo?.lng || 0),
    };
    setFieldValue(name, location);
  };

  const errorMsg = touched[field.name] && errors[field.name];
  return (
    <View style={InputStyles.container}>
      <Text style={{color: COLOUR_SUBTLE}}>{label}</Text>
      <GooglePlacesAutocomplete
        placeholder="Search location"
        enablePoweredByContainer={false}
        fetchDetails
        debounce={200}
        onPress={parseLocation}
        query={{
          key: 'AIzaSyATlh33NsyFpAFAN3tWPndY6HLlZD_tdMg',
          language: 'en',
          type: ['locality', 'country'],
        }}
        textInputProps={{
          InputComp: SearchInput,
          style: {height: 44, width: '100%'},
          errorStyle: {color: 'red'},
        }}
      />
    </View>
  );
};
