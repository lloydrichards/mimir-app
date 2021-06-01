import {Location} from '@mimir/GenericType';
import {firebase} from '@react-native-firebase/firestore';
import {InputStyles} from '@styles/GlobalStyle';
import {FieldProps} from 'formik';
import React from 'react';
import {View} from 'react-native';
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
import {Text} from 'react-native-paper';
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
      <Text>{label}</Text>
      <GooglePlacesAutocomplete
        placeholder="Search"
        fetchDetails
        currentLocation
        debounce={200}
        renderDescription={row => row.description}
        numberOfLines={3}
        onPress={parseLocation}
        query={{
          key: 'AIzaSyATlh33NsyFpAFAN3tWPndY6HLlZD_tdMg',
          language: 'en',
          type: ['locality', 'country'],
        }}
      />
    </View>
  );
};
