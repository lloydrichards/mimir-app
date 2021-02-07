import { Button, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import { Link } from 'react-router-dom';
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
      <div
        style={{
          padding: '1rem',
          border: '2px solid lightgrey',
          borderRadius: '0.5rem',
        }}>
        <Typography variant='h4' align='center'>
          Sign Up
        </Typography>
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
              <Button
                style={{ marginTop: '1rem' }}
                fullWidth
                color='primary'
                variant='contained'
                type='submit'
                disabled={isSubmitting}>
                Sign Up
              </Button>
              {status ? <div>{status.message}</div> : null}
            </Form>
          )}
        </Formik>
      </div>
      <Typography style={{ margin: '1rem' }} variant='body1' align='center'>
        Already have an Account? <Link to='/login'>Login</Link>
      </Typography>
    </div>
  );
};

export default SignUp;
