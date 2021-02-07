import { Button, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { TextField } from '../Atom-Inputs/TextField';
import { useAuth } from './Auth';

const validationSchema = yup.object({
  email: yup.string().required().email(),
});

const ForgotPassoword = () => {
  const { resetPassword } = useAuth();

  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  return (
    <div>
      <div
        style={{
          padding: '1rem',
          border: '2px solid lightgrey',
          borderRadius: '0.5rem',
        }}>
        <Typography variant='h4' align='center'>
          Password Reset
        </Typography>
        <Formik
          onSubmit={async (data, { setStatus, setSubmitting, resetForm }) => {
            try {
              setSubmitting(true);
              setMessage('');
              setError('');
              await resetPassword(data.email);
              setMessage('Check your email for further instructions.');
              resetForm();
            } catch (error) {
              console.log('error:', error);
              alert(error);
              setStatus(error);
              setError('Failed to reset password');
            }

            setSubmitting(false);
          }}
          validationSchema={validationSchema}
          initialValues={{
            email: '',
          }}>
          {({ isSubmitting, values, status }) => (
            <Form>
              {message && (
                <Typography
                  align='center'
                  color='textSecondary'
                  variant='body1'>
                  {message}
                </Typography>
              )}
              {error && (
                <Typography align='center' color='error' variant='body1'>
                  {error}
                </Typography>
              )}
              <TextField
                label='Email '
                name='email'
                placeholder='Email'
                type='input'
              />
              <Button
                style={{ marginTop: '1rem' }}
                fullWidth
                color='primary'
                variant='contained'
                type='submit'
                disabled={isSubmitting}>
                Reset Password
              </Button>
              {status ? <div>{status.message}</div> : null}
            </Form>
          )}
        </Formik>
        <Typography
          style={{ marginTop: '1rem' }}
          variant='body1'
          align='center'>
          <Link to='/login'>Login</Link>
        </Typography>
      </div>
      <Typography style={{ margin: '1rem' }} variant='body1' align='center'>
        Need an Account? <Link to='/signup'>Sign Up</Link>
      </Typography>
    </div>
  );
};

export default ForgotPassoword;
