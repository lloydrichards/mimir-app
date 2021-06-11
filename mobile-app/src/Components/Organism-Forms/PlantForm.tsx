import {
  OriginTypes,
  PlantInput,
  PlantProps,
  PlantType,
  PotType,
  PotTypes,
} from '@mimir/PlantType';
import {SpaceType} from '@mimir/SpaceType';
import {InputStyles} from '@styles/GlobalStyle';
import {Field, Formik} from 'formik';
import * as React from 'react';
import {Alert, ScrollView, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import * as yup from 'yup';
import {OptionItem, OptionPicker} from '../Atom-Inputs/OptionPicker';
import {TextInput} from '../Atom-Inputs/TextInput';
import {useAuth} from '../Auth/Auth';
import {FormTypeMap} from '../Molecule-Data/FormTypeMap';
import {OriginTypesMap} from '../Molecule-Data/OriginTypesMap';
import {SpeciesAutoComplete} from '../Molecule-FormInput/SpeciesAutoComplete';

const validationSchema = yup.object({
  nickname: yup.string().required(),
  description: yup.string(),
  origin: yup.string().required(),
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
              origin: data.origin,
              picture: data.picture,
              parent: data.parent,
              species: data.species,
              owner: {
                name: currentUser?.displayName || '',
                email: currentUser?.email || '',
                id: currentUser?.uid || '',
              },
            };

            const defaultPot: PotType = {
              hanging: false,
              size: 1,
              tray: true,
              type: 'TERRACOTTA',
            };

            const newPlant = await plant.add(space, input, defaultPot);
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
          origin: edit?.origin || ('' as OriginTypes),
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
            <Field
              name="space"
              label="Space"
              placeholder="Select Space..."
              component={OptionPicker}>
              {spaceDocs.map(s => (
                <OptionItem key={s.id} value={s.id} label={s.name} />
              ))}
            </Field>
            {plantDocs.length > 0 && (
              <Field
                name="parent"
                label="Plant parent"
                placeholder="Select Parent Plant..."
                onChange={(value: string | undefined) => {
                  if (!value) return setFieldValue('parent', undefined);
                  const parent = plantDocs.find(p => p.id === value);
                  setFieldValue('species', parent?.species);
                  return setFieldValue('parent', {
                    id: parent?.id,
                    name: parent?.nickname,
                    owner: parent?.owner,
                  });
                }}
                component={OptionPicker}>
                <OptionItem value={undefined} label="(none)" style={{fontStyle:"italic"}} />
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
              name="nickname"
              label="Name"
              placeholder="Plant's name..."
              component={TextInput}
            />
            <Field
              name="description"
              label="Description"
              placeholder="Plant's description..."
              component={TextInput}
            />
            <Field
              name="origin"
              label="Plant Origin"
              placeholder="Select Origin..."
              component={OptionPicker}>
              {OriginTypesMap.map(d => (
                <OptionItem key={d.id} value={d.id} label={d.field} />
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
