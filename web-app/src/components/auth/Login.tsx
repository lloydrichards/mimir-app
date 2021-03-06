import { Button, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { PasswordField } from '../Atom-Inputs/PasswordField';
import { TextField } from '../Atom-Inputs/TextField';
import { useAuth } from './Auth';

const validationSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required(),
});

const Login = () => {
  const history = useHistory();
  const { login } = useAuth();
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
          Login
        </Typography>
        <Formik
          onSubmit={async (data, { setStatus, setSubmitting, resetForm }) => {
            setSubmitting(true);
            try {
              await login(data.email, data.password).then((res) => {
                console.log('Logged In!');
              });
              resetForm();
              history.push('/');
            } catch (error) {
              console.log('error:', error);
              alert(error);
              setStatus(error);
            }

            setSubmitting(false);
          }}
          validationSchema={validationSchema}
          initialValues={{
            email: '',
            password: '',
          }}>
          {({ isSubmitting, values, status }) => (
            <Form>
              <TextField
                label='Email '
                name='email'
                placeholder='Email'
                type='input'
              />
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
                Login
              </Button>
              {status ? <div>{status.message}</div> : null}
            </Form>
          )}
        </Formik>
        <Typography
          style={{ marginTop: '1rem' }}
          variant='body1'
          align='center'>
          <Link to='/forgot-password'>Forgot Password?</Link>
        </Typography>
      </div>
      <Typography style={{ margin: '1rem' }} variant='body1' align='center'>
        Need an Account? <Link to='/signup'>Sign Up</Link>
      </Typography>
    </div>
  );
};

export default Login;
