import { Button, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import * as React from 'react';
import { TextField } from '../Atom-Inputs/TextField';
import app from '../../firebase';
import { useHistory } from 'react-router-dom';

interface Props {
  altButton?: { label: string; onClick: () => void };
  debug?: boolean;
}
const db = app.firestore();

const basicForm: React.FC<Props> = ({ altButton, debug }) => {
  const history = useHistory();
  return (
    <div>
      <Formik
        onSubmit={async (data, { setStatus, setSubmitting, resetForm }) => {
          const batch = db.batch();

          setSubmitting(true);
          try {
            console.log(data);
          } catch (error) {
            console.log('error:', error);
            alert(error);
            setStatus(error);
          }

          setSubmitting(false);
        }}
        initialValues={{}}>
        {({ isSubmitting, values, status, errors }) => (
          <Form>
            <TextField
              label='Username'
              name='username'
              placeholder='Display Name'
            />

            <div style={{ display: 'flex' }}>
              {altButton && (
                <Button fullWidth onClick={altButton.onClick}>
                  {altButton.label}
                </Button>
              )}
              <Button
                fullWidth
                variant='contained'
                color='primary'
                type='submit'
                disabled={isSubmitting}>
                Update
              </Button>
            </div>
            <div
              style={{
                border: '2px dashed lightgrey',
                background: 'snow',
                margin: '1rem 0',
                borderRadius: '1rem',
                padding: '1rem',
              }}>
              <Typography variant='h4'>Debug</Typography>
              {status ? <div>{status.message}</div> : null}
              {debug ? (
                <div>
                  <pre>{JSON.stringify(values, null, 2)}</pre>
                  <pre>{JSON.stringify(errors, null, 2)}</pre>
                </div>
              ) : null}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default basicForm;
