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
import {DeviceProps, DeviceRegisterInput, DeviceType} from '@mimir/DeviceType';
import {timestamp} from 'src/Services/firebase';

const validationSchema = yup.object({
  space: yup.object().required(),
  device: yup.object().required(),
  nickname: yup.string().required(),
  description: yup.string(),
});

interface Props {
  space?: SpaceType;
  edit?: DeviceProps & {id: string};
  onComplete: (space: SpaceType) => void;
}

const DeviceForm: React.FC<Props> = ({space, edit, onComplete}) => {
  const {currentUser, device, spaceDocs} = useAuth();
  return (
    <View style={InputStyles.form}>
      <Formik
        onSubmit={async (data, {setStatus, setSubmitting, resetForm}) => {
          setSubmitting(true);

          try {
            if (!data.device) throw new Error('No Device');
            if (!data.space) throw new Error('No Space');
            const input: DeviceRegisterInput = {
              date_registered: timestamp,
              description: data.description,
              id: data.device.id,
              nickname: data.nickname,
              owner: {
                name: currentUser?.displayName || '',
                email: currentUser?.email || '',
                id: currentUser?.uid || '',
              },
            };
            await device.register(data.space, input);
            console.log(data);
            resetForm();
            onComplete(data.space);
          } catch (error) {
            console.log('error:', error);
            Alert.alert(error);
            setStatus(error);
          }

          setSubmitting(false);
        }}
        validationSchema={validationSchema}
        initialValues={{
          space: space || null,
          device: edit || null,
          nickname: edit?.nickname || '',
          description: edit?.description || '',
        }}>
        {({handleSubmit, isSubmitting, values, status, errors}) => (
          <ScrollView keyboardShouldPersistTaps="handled">
            <Field name="space" label="Space" component={OptionPicker}>
              {spaceDocs.map(s => (
                <OptionItem key={s.id} value={s.id} label={s.name} />
              ))}
            </Field>
            <Field
              name="nickname"
              label="Nickname"
              placeholder="device's name..."
              component={TextInput}
            />
            <Field
              name="description"
              label="Description"
              component={TextInput}
            />
            <View style={{marginTop: 32}}>
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

export default DeviceForm;
