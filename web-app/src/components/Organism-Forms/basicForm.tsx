import { Button, MenuItem, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import * as React from 'react';
import { TextField } from '../Atom-Inputs/TextField';
import app, { timestamp } from '../../firebase';
import { TextArea } from '../Atom-Inputs/TextArea';
import { Selector } from '../Atom-Inputs/Selector';
import { useHistory } from 'react-router-dom';
import { UserProps } from '../../types/UserType';
import { Log } from '../../types/GenericType';

interface Props {}
const db = app.firestore();

const basicForm: React.FC<Props> = ({}) => {
  const history = useHistory();
  return (
    <div>
      <Formik
        onSubmit={async (data, { setStatus, setSubmitting, resetForm }) => {
          const batch = db.batch();

          setSubmitting(true);
          try {
          } catch (error) {
            console.log('error:', error);
            alert(error);
            setStatus(error);
          }

          setSubmitting(false);
        }}
        initialValues={{}}>
        {({ isSubmitting, values, status }) => (
          <Form>
            <TextField
              label='Username'
              name='username'
              placeholder='Display Name'
            />

            <Button variant='contained' type='submit' disabled={isSubmitting}>
              Update
            </Button>
            <Button variant='outlined'>Cancel</Button>
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
              <pre>{JSON.stringify(values, null, 2)}</pre>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default basicForm;
