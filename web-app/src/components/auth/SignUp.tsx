import { Button } from '@material-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { PasswordField } from '../Atom-Inputs/PasswordField';
import { TextField } from '../Atom-Inputs/TextField';
import { useAuth } from './Auth';

const validationSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required(),
});

const SignUp = () => {
  const { login, signUp } = useAuth();
  if (!login) return <div />;
  return (
    <div>
      <Formik
        onSubmit={async (data, { setStatus, setSubmitting, resetForm }) => {
          setSubmitting(true);
          try {
            await signUp(data.email, data.password).then((res) =>
              res.user?.updateProfile({ displayName: data.name })
            );
            resetForm();
          } catch (error) {
            console.log('error:', error);
            alert(error);
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
        {({ isSubmitting, values, status }) => (
          <Form>
            <TextField
              label='Name '
              name='name'
              placeholder='Display Name'
              type='input'
            />{' '}
            <br />
            <TextField
              label='Email '
              name='email'
              placeholder='Email'
              type='input'
            />{' '}
            <br />
            <PasswordField
              label='Password'
              name='password'
              placeholder='Password'
            />
            <Button type='submit' disabled={isSubmitting}>
              Sign Up
            </Button>
            {status ? <div>{status.message}</div> : null}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
