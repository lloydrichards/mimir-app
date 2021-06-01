import {InputStyles} from '@styles/GlobalStyle';
import {Field, Formik} from 'formik';
import * as React from 'react';
import {Alert, View} from 'react-native';
import {Button, Text} from 'react-native-paper';

interface Props {}

const basicForm: React.FC<Props> = ({}) => {
  return (
    <View style={InputStyles.form}>
      <Text style={InputStyles.title}>Login Form</Text>

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
        initialValues={{}}>
        {({handleSubmit, isSubmitting, values, status, errors}) => (
          <View>
            <Field />

            <Button
              disabled={isSubmitting}
              loading={isSubmitting}
              onPress={handleSubmit}>
              Update
            </Button>
            {status && <Text>{status.message}</Text>}
          </View>
        )}
      </Formik>
    </View>
  );
};

export default basicForm;
