import firebase from '../../firebase';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useContext } from 'react';
import * as yup from 'yup';
import { AuthContext } from './Auth';

const validationSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required(),
});

const Login = () => {
  const authContext = useContext(AuthContext);
  return (
    <div>
      <Formik
        onSubmit={async (data, { setStatus, setSubmitting }) => {
          setSubmitting(true);
          try {
            await firebase
              .auth()
              .signInWithEmailAndPassword(data.email, data.password)
              .then((res) => {
                console.log(res);
                authContext.setCurrentUser(res);
              });
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
            <Field type='email' name='email' />
            <ErrorMessage name='email' component='div' />
            <Field type='password' name='password' />
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
