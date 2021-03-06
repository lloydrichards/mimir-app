import {COLOUR_SECONDARY} from 'src/Styles/Colours';
import {Field, Form, Formik} from 'formik';
import React from 'react';
import {View} from 'react-native';
import * as yup from 'yup';
import {useAuth} from './Auth';
import {Button, Text} from 'react-native-paper';
import {InputStyles} from '@styles/GlobalStyle';
import {TextInput} from '../Atom-Inputs/TextInput';

const validationSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().required(),
});

const SignUp = () => {
  const {login, signUp} = useAuth();
  if (!login) return <div />;
  return (
    <View style={InputStyles.form}>
      <Text style={InputStyles.title}>Register Form</Text>
      <Formik
        onSubmit={async (data, {setStatus, setSubmitting, resetForm}) => {
          setSubmitting(true);
          try {
            await signUp(data.email, data.password).then(res =>
              res.user?.updateProfile({displayName: data.username}),
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
          username: '',
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
            <Field name="username" label="Username" component={TextInput} />
            <Field name="email" label="Email" component={TextInput} />
            <Field
              name="password"
              label="Password"
              secureTextEntry={true}
              component={TextInput}
            />
            <View style={{marginVertical: 16}}>
              <Button
                mode="contained"
                color={COLOUR_SECONDARY}
                onPress={handleSubmit}
                disabled={isSubmitting}>
                Register
              </Button>
            </View>
            {status && <Text>{status.message}</Text>}
          </View>
        )}
      </Formik>
    </View>
  );
};

export default SignUp;
