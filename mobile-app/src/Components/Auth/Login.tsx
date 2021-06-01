import {Field, Formik} from 'formik';
import React from 'react';
import {Text, View} from 'react-native';
import {useHistory} from 'react-router-native';
import * as yup from 'yup';
import {COLOUR_SECONDARY} from '../../Styles/Colours';
import {useAuth} from './Auth';
import {Button} from 'react-native-paper';
import {InputStyles, TextStyles} from '@styles/GlobalStyle';
import {TextInput} from '../Atom-Inputs/TextInput';

const validationSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required(),
});

const Login = () => {
  const history = useHistory();
  const {login} = useAuth();
  return (
    <View style={InputStyles.form}>
      <Text style={InputStyles.title}>Login Form</Text>
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
        {({handleSubmit, isSubmitting, status}) => (
          <View>
            <Field name="email" label="Email" component={TextInput} />
            <Field
              name="password"
              label="Password"
              secureTextEntry={true}
              component={TextInput}
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
