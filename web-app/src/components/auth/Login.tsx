import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { useAuth } from './Auth';

const validationSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required(),
});

const Login = () => {
  const { login } = useAuth();
  if (!login) return <div />;
  return (
    <div>
      <Formik
        onSubmit={async (data, { setStatus, setSubmitting, resetForm }) => {
          setSubmitting(true);
          try {
            await login(data.email, data.password).then((res) => {
              console.log(res);
            });
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
          email: '',
          password: '',
        }}>
        {({ isSubmitting, values, status }) => (
          <Form>
            <Field type='email' name='email' placeholder='Email' />
            <ErrorMessage name='email' component='div' />
            <br />
            <Field type='password' name='password' placeholder='Password' />
            <ErrorMessage name='password' component='div' />
            <button type='submit' disabled={isSubmitting}>
              Submit
            </button>
            {status ? <div>{status.message}</div> : null}
            <h2>DEBUGGER</h2>
            <pre>{JSON.stringify(values, null, 2)}</pre>
            <pre>{JSON.stringify(status, null, 2)}</pre>{' '}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
