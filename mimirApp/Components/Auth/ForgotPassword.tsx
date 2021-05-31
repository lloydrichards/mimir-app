import {Form, Formik} from 'formik';
import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import * as yup from 'yup';
import {useAuth} from './Auth';

const validationSchema = yup.object({
  email: yup.string().required().email(),
});

const ForgotPassoword = () => {
  const {resetPassword} = useAuth();

  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  return (
    <View>
      <View>
        <Text>Password Reset</Text>
        <Formik
          onSubmit={async (data, {setStatus, setSubmitting, resetForm}) => {
            try {
              setSubmitting(true);
              setMessage('');
              setError('');
              await resetPassword(data.email);
              setMessage('Check your email for further instructions.');
              resetForm();
            } catch (error) {
              console.log('error:', error);
              setStatus(error);
              setError('Failed to reset password');
            }

            setSubmitting(false);
          }}
          validationSchema={validationSchema}
          initialValues={{
            email: '',
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            values,
            status,
          }) => (
            <Form>
              <TextInput
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              <Button
                title="Sign Up"
                onPress={handleSubmit}
                disabled={isSubmitting}
              />
              {status ? <div>{status.message}</div> : null}
            </Form>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default ForgotPassoword;
