import { Button, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import * as React from 'react';
import { TextField } from '../Atom-Inputs/TextField';
import app, { timestamp } from '../../firebase';
import { TextArea } from '../Atom-Inputs/TextArea';
import { useAuth } from '../auth/Auth';
import { SearchDevice } from '../Molecule-FormInputs/SearchDevice';

interface Props {
  altButton?: { label: string; onClick: () => void };
  debug?: boolean;
}
const db = app.firestore();

const DeviceForm: React.FC<Props> = ({ altButton, debug }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <div></div>;
  return (
    <div>
      <Formik
        onSubmit={async (data, { setStatus, setSubmitting, resetForm }) => {
          setSubmitting(true);
          try {
            if (!data.device_id) throw { error: 'No Device ID' };
            const deviceRef = db.collection('mimirDevices').doc(data.device_id);
            deviceRef.update({
              date_modified: timestamp,
              date_registered: timestamp,
              owner: data.owner,
              nickname: data.nickname,
              description: data.description,
            });
            resetForm();
          } catch (error) {
            console.log('error:', error);
            alert(error);
            setStatus(error);
          }

          setSubmitting(false);
        }}
        initialValues={{
          device_id: '',
          nickname: '',
          description: '',
          owner: {
            name: currentUser.displayName,
            id: currentUser.uid,
            email: currentUser.email,
          },
        }}>
        {({ isSubmitting, values, status, errors }) => (
          <Form>
            <SearchDevice
              label='Registration Key'
              placeholder='Enter the registration key found one the base of the device...'
              name='device_id'
            />
            <TextField
              label='Nickname'
              name='nickname'
              placeholder='Device Nickname'
            />
            <TextArea
              label='Description'
              name='description'
              placeholder='Description of device'
              rowsMax={3}
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

            {status ? <div>{status.message}</div> : null}
            {debug ? (
              <div
                style={{
                  border: '2px dashed tomato',
                  background: 'snow',
                  margin: '1rem 0',
                  borderRadius: '1rem',
                  padding: '0.5rem',
                }}>
                <Typography variant='h4'>Debug</Typography>
                <pre>{JSON.stringify(values, null, 2)}</pre>
                <pre>{JSON.stringify(errors, null, 2)}</pre>
              </div>
            ) : null}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DeviceForm;
