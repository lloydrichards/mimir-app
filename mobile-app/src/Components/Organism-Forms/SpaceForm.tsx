import {PlantInput, PlantProps} from '@mimir/PlantType';
import {InputStyles} from '@styles/GlobalStyle';
import {Field, Formik} from 'formik';
import * as React from 'react';
import {Alert, ScrollView, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {OptionItem, OptionPicker} from '../Atom-Inputs/OptionPicker';
import {SpeciesAutoComplete} from '../Molecule-FormInput/SpeciesAutoComplete';
import {TextInput} from '../Atom-Inputs/TextInput';
import {FormTypeMap} from '../Molecule-Data/FormTypeMap';
import {SpaceProps} from '@mimir/SpaceType';
import {RoomTypeMap} from '../Molecule-Data/RoomTypeMap';
import LightDirectionPicker from '../Molecule-FormInput/LightDirectionPicker';
import {LocationAutoComplete} from '../Molecule-FormInput/LocationAutoComplete';

interface Props {
  data?: SpaceProps;
}

const SpaceForm: React.FC<Props> = ({data}) => {
  return (
    <View style={InputStyles.form}>
      <Formik
        onSubmit={async (data, {setStatus, setSubmitting, resetForm}) => {
          setSubmitting(true);
          try {
            console.log(data);
            resetForm();
          } catch (error) {
            console.log('error:', error);
            Alert.alert(error);
            setStatus(error);
          }

          setSubmitting(false);
        }}
        initialValues={{
          name: data?.name || '',
          description: data?.description || '',
          room_type: data?.room_type || null,
          picture: data?.picture || null,
          light_direction: data?.light_direction || [],
          location: data?.location || null,
        }}>
        {({handleSubmit, isSubmitting, values, status, errors}) => (
          <View>
            <ScrollView
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="always">
              <Field name="name" label="Space name" component={TextInput} />
              <Field
                name="location"
                label="Location"
                component={LocationAutoComplete}
              />

              <Field
                name="description"
                label="Space description"
                component={TextInput}
              />
              <Field
                name="light_direction"
                label="Light Direction"
                component={LightDirectionPicker}
              />
              <Field
                name="room_type"
                label="Room type"
                component={OptionPicker}>
                {RoomTypeMap.map(d => (
                  <OptionItem key={d.id} value={d.id} label={d.field} />
                ))}
              </Field>
            </ScrollView>
            <Button
              mode="contained"
              disabled={isSubmitting}
              loading={isSubmitting}
              onPress={handleSubmit}>
              Add Space
            </Button>
            {status && <Text>{status.message}</Text>}
          </View>
        )}
      </Formik>
    </View>
  );
};

export default SpaceForm;
