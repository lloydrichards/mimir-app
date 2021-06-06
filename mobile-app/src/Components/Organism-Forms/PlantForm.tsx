import {PlantInput, PlantProps, PlantType, SpeciesType} from '@mimir/PlantType';
import {InputStyles} from '@styles/GlobalStyle';
import {Field, Formik} from 'formik';
import * as React from 'react';
import {Alert, ScrollView, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {OptionItem, OptionPicker} from '../Atom-Inputs/OptionPicker';
import {SpeciesAutoComplete} from '../Molecule-FormInput/SpeciesAutoComplete';
import {TextInput} from '../Atom-Inputs/TextInput';
import {FormTypeMap} from '../Molecule-Data/FormTypeMap';
import {useAuth} from '../Auth/Auth';
import * as yup from 'yup';
import {FormTypes} from '@mimir/SpeciesType';
import {SpaceType} from '@mimir/SpaceType';
import SearchInput from '../Atom-Inputs/SearchInput';
import {ItemValue} from '@react-native-picker/picker/typings/Picker';

const validationSchema = yup.object({
  nickname: yup.string().required(),
  description: yup.string(),
  form: yup.string().required(),
  parent: yup
    .object({
      id: yup.string(),
      name: yup.string(),
      owner: yup.object({
        id: yup.string(),
        name: yup.string(),
        email: yup.string(),
      }),
    })
    .nullable(),
  space: yup.string().required(),
  species: yup
    .object({
      family: yup.string(),
      genus: yup.string(),
      species: yup.string(),
      subspecies: yup.string().nullable(),
      cultivar: yup.string().nullable(),
      id: yup.string(),
      type: yup.string(),
    })
    .required(),
});

interface Props {
  edit?: PlantProps;
  onComplete: (plant: PlantType) => void;
}

const PlantForm: React.FC<Props> = ({edit, onComplete}) => {
  const {currentUser} = useAuth();
  const {spaceDocs, plantDocs, plant} = useAuth();
  return (
    <View style={InputStyles.form}>
      <Formik
        onSubmit={async (data, {setStatus, setSubmitting, resetForm}) => {
          console.log('Submitting Plant...');

          setSubmitting(true);
          try {
            if (!data.species) throw new Error('Species missing');
            const selectedSpace = spaceDocs.find(s => s.id === data.space);
            if (!selectedSpace) throw new Error('No Space Found');
            const space: SpaceType = {
              id: selectedSpace?.id,
              name: selectedSpace.name,
              room_type: selectedSpace.room_type,
              light_direction: selectedSpace.light_direction,
            };
            if (selectedSpace.picture) {
              space.thumb = selectedSpace.picture?.thumb;
            }

            const input: PlantInput = {
              nickname: data.nickname,
              description: data.description,
              form: data.form,
              picture: data.picture,
              parent: data.parent,
              species: data.species,
              owner: {
                name: currentUser?.displayName || '',
                email: currentUser?.email || '',
                id: currentUser?.uid || '',
              },
            };
            console.log(data);
            const newPlant = await plant.add(space, input);
            resetForm();
            onComplete(newPlant);
          } catch (error) {
            console.log('error:', error);
            Alert.alert(error);
            setStatus(error);
          }

          setSubmitting(false);
        }}
        validationSchema={validationSchema}
        initialValues={{
          nickname: edit?.nickname || '',
          description: edit?.description || '',
          form: edit?.form || ('' as FormTypes),
          parent: edit?.parent || null,
          picture: edit?.picture || null,
          space: null,
          species: edit?.species || null,
        }}>
        {({
          handleSubmit,
          setFieldValue,
          isSubmitting,
          values,
          status,
          errors,
        }) => (
          <ScrollView nestedScrollEnabled={true}>
            <Field name="space" label="Space" component={OptionPicker}>
              {spaceDocs.map(s => (
                <OptionItem key={s.id} value={s.id} label={s.name} />
              ))}
            </Field>
            <Field
              name="nickname"
              label="Name"
              placeholder="Plant's name..."
              component={TextInput}
            />
            {plantDocs.length > 0 && (
              <Field
                name="parent"
                label="Plant parent"
                onChange={(value: string) => {
                  const parent = plantDocs.find(p => p.id === value);
                  setFieldValue('species', parent?.species);
                  return setFieldValue('parent', {
                    id: parent?.id,
                    name: parent?.nickname,
                    owner: parent?.owner,
                  });
                }}
                component={OptionPicker}>
                <OptionItem value="" label="(none)" />
                {plantDocs.map(s => {
                  return (
                    <OptionItem key={s.id} value={s.id} label={s.nickname} />
                  );
                })}
              </Field>
            )}
            {values.parent ? (
              <Text style={{fontSize: 16, paddingHorizontal: 8}}>
                {plantDocs.find(p => p.id === values.parent?.id)?.species.id}
              </Text>
            ) : (
              <Field
                name="species"
                label="Species"
                component={SpeciesAutoComplete}
              />
            )}
            <Field
              name="description"
              label="Description"
              placeholder="Plant's description..."
              component={TextInput}
            />
            <Field name="form" label="Plant form" component={OptionPicker}>
              {FormTypeMap.map(d => (
                <OptionItem key={d.id} value={d.id} label={d.name} />
              ))}
            </Field>

            <View style={{marginTop: 32}}>
              {status && <Text>{status.message}</Text>}
              {errors && <Text>{errors.parent}</Text>}
              <Button
                mode="contained"
                disabled={isSubmitting}
                loading={isSubmitting}
                onPress={handleSubmit}>
                Add Plant
              </Button>
            </View>
          </ScrollView>
        )}
      </Formik>
    </View>
  );
};

export default PlantForm;
