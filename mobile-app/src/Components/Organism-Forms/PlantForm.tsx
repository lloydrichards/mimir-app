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

interface Props {
  data?: PlantProps;
}

const PlantForm: React.FC<Props> = ({data}) => {
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
          nickname: data?.nickname || '',
          description: '',
          form: '',
          parent: null,
          space: null,
          species: null,
        }}>
        {({handleSubmit, isSubmitting, values, status, errors}) => (
          <View>
            <ScrollView nestedScrollEnabled={true}>
              <Field name="space" label="Space" component={OptionPicker}>
                <OptionItem value="TODO" label="TODO" />
              </Field>
              <Field
                name="nickname"
                label="Name"
                placeholder="Plant's name..."
                component={TextInput}
              />
              <Field
                name="parent"
                label="Plant parent"
                component={OptionPicker}>
                <OptionItem value="TODO" label="TODO" />
              </Field>
              <Field
                name="species"
                label="Species"
                component={SpeciesAutoComplete}
              />
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
            </ScrollView>
            <Button
              mode="contained"
              disabled={isSubmitting}
              loading={isSubmitting}
              onPress={handleSubmit}>
              Add Plant
            </Button>
            {status && <Text>{status.message}</Text>}
          </View>
        )}
      </Formik>
    </View>
  );
};

export default PlantForm;
