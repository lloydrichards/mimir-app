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
import {SpaceInput, SpaceProps, SpaceType} from '@mimir/SpaceType';
import {RoomTypeMap} from '../Molecule-Data/RoomTypeMap';
import LightDirectionPicker from '../Molecule-FormInput/LightDirectionPicker';
import {LocationAutoComplete} from '../Molecule-FormInput/LocationAutoComplete';
import {ExposureTypeMap} from '../Molecule-Data/ExposureTypeMap';
import * as yup from 'yup';
import {Location} from '@mimir/GenericType';
import {useAuth} from '../Auth/Auth';
import {ExposureTypes} from '@mimir/SpeciesType';

const validationSchema = yup.object({
  name: yup.string().required(),
  location: yup
    .object({
      city: yup.string(),
      country: yup.string(),
      region: yup.string(),
    })
    .required(),
  description: yup.string(),
  room_type: yup.string().required(),
  light_direction: yup.array(),
  exposure: yup.string().required(),
});

interface Props {
  edit?: SpaceProps;
  onComplete: (space: SpaceType) => void;
}

const SpaceForm: React.FC<Props> = ({edit, onComplete}) => {
  const {currentUser, space, userDoc} = useAuth();
  return (
    <View style={InputStyles.form}>
      <Formik
        onSubmit={async (data, {setStatus, setSubmitting, resetForm}) => {
          setSubmitting(true);
          try {
            if (!data.room_type) throw new Error('Room Type missing');
            if (!data.location) throw new Error('Location missing');
            const input: SpaceInput = {
              ...data,
              room_type: data.room_type,
              location: data.location,
              owner: {
                name: currentUser?.displayName || '',
                email: currentUser?.email || '',
                id: currentUser?.uid || '',
              },
            };
            const newSpace = await space.add(input);
            console.log(data);
            resetForm();
            onComplete(newSpace);
          } catch (error) {
            console.log('error:', error);
            Alert.alert(error);
            setStatus(error);
          }

          setSubmitting(false);
        }}
        validationSchema={validationSchema}
        initialValues={{
          name: edit?.name || '',
          location: edit?.location || userDoc?.location || null,
          description: edit?.description || '',
          room_type: edit?.room_type || null,
          picture: edit?.picture || null,
          light_direction: edit?.light_direction || [],
          exposure: edit?.exposure || ('' as ExposureTypes),
        }}>
        {({handleSubmit, isSubmitting, values, status, errors}) => (
          <ScrollView keyboardShouldPersistTaps="handled">
            <Field
              name="name"
              label="Name"
              placeholder="Space's name..."
              component={TextInput}
            />
            <Field
              name="location"
              label="Location"
              component={LocationAutoComplete}
            />
            <Field
              name="description"
              label="Description"
              placeholder="Space's description..."
              component={TextInput}
            />
            <Field
              name="room_type"
              label="Room type"
              placeholder="Select room type..."
              component={OptionPicker}>
              {RoomTypeMap.map(d => (
                <OptionItem key={d.id} value={d.id} label={d.field} />
              ))}
            </Field>
            <Field
              name="exposure"
              label="Sun Exposure"
              placeholder="Select sun exposure..."
              component={OptionPicker}>
              {ExposureTypeMap.map(d => (
                <OptionItem key={d.id} value={d.id} label={d.field} />
              ))}
            </Field>
            <Field
              name="light_direction"
              label="Light Direction"
              component={LightDirectionPicker}
            />

            <View style={{marginTop: 16}}>
              {status && <Text>{status.message}</Text>}
              <Button
                mode="contained"
                disabled={isSubmitting}
                loading={isSubmitting}
                onPress={handleSubmit}>
                Add Space
              </Button>
            </View>
          </ScrollView>
        )}
      </Formik>
    </View>
  );
};

export default SpaceForm;
