import { Formik } from 'formik';
import React from 'react';
import { Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useHistory } from 'react-router-native';
import * as yup from 'yup';
import { COLOUR_SECONDARY } from '../../Styles/Colours';
import { useAuth } from './Auth';

const validationSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required(),
});

const Login = () => {
  const history = useHistory();
  const {login} = useAuth();
  return (
    <View>
      <Text>Login Form</Text>
      <Formik
        onSubmit={async (data, {setStatus, setSubmitting, resetForm}) => {
          setSubmitting(true);
          try {
            await login(data.email, data.password).then(res => {
              console.log('Logged In!');
            });
            resetForm();
            history.push('/');
          } catch (error) {
            console.log('error:', error);
            setStatus(error);
          }

          setSubmitting(false);
        }}
        validationSchema={validationSchema}
        initialValues={{
          email: '',
          password: '',
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          values,
          status,
        }) => (
          <View>
            <TextInput
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            <TextInput
              placeholder="password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              textContentType="password"
              passwordRules="required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8;"
            />
            <Button
              mode="contained"
              color={COLOUR_SECONDARY}
              onPress={handleSubmit}
              disabled={isSubmitting}>
              Login
            </Button>
            {status && <Text>{status.message}</Text>}
          </View>
        )}
      </Formik>
    </View>
  );
};

export default Login;
