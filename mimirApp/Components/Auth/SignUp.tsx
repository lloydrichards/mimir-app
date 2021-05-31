import {Form, Formik} from 'formik';
import React from 'react';
import {Button, Text, TextInput} from 'react-native';
import {Link} from 'react-router-native';
import * as yup from 'yup';
import {useAuth} from './Auth';

const validationSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required(),
});

const SignUp = () => {
  const {login, signUp} = useAuth();
  if (!login) return <div />;
  return (
    <div>
      <div
        style={{
          padding: '1rem',
          border: '2px solid lightgrey',
          borderRadius: '0.5rem',
        }}>
        <Text>Sign Up</Text>
        <Formik
          onSubmit={async (data, {setStatus, setSubmitting, resetForm}) => {
            setSubmitting(true);
            try {
              await signUp(data.email, data.password).then(res =>
                res.user?.updateProfile({displayName: data.name}),
              );
              resetForm();
            } catch (error) {
              console.log('error:', error);
              setStatus(error);
            }

            setSubmitting(false);
          }}
          validationSchema={validationSchema}
          initialValues={{
            name: '',
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
            <Form>
              <TextInput
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.email}
              />
              <TextInput
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              <TextInput
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              <Button
                title="Sign Up"
                onPress={handleSubmit}
                disabled={isSubmitting}
              />
              {status && <Text>{status.message}</Text>}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
