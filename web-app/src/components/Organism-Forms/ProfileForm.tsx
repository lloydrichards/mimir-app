import { Button, MenuItem, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import * as React from 'react';
import { TextField } from '../Atom-Inputs/TextField';
import app, { auth, timestamp } from '../../firebase';
import { TextArea } from '../Atom-Inputs/TextArea';
import { Selector } from '../Atom-Inputs/Selector';
import { useHistory } from 'react-router-dom';
import { UserProps } from '../../types/UserType';
import { Picture } from '../../types/GenericType';
import UploadPictureForm from '../Molecule-FormInputs/UploadPictureForm';
import { useAuth } from '../auth/Auth';
import { Log } from '../../types/LogType';

interface Props {
  userId: string;
  userDoc: UserProps;
  altButton?: { label: string; onClick: () => void };
  debug?: boolean;
}
const db = app.firestore();

const UpdateProfile: React.FC<Props> = ({
  userId,
  userDoc,
  altButton,
  debug,
}) => {
  const history = useHistory();
  const { currentUser } = useAuth();

  const [picture, setPicture] = React.useState<Picture | null>(
    userDoc.profile_picture
  );

  return (
    <div>
      <Formik
        onSubmit={async (data, { setStatus, setSubmitting, resetForm }) => {
          const batch = db.batch();
          const userRef = db.collection('mimirUsers').doc(userId);
          const userLog = userRef.collection('Logs').doc();
          setSubmitting(true);
          try {
            const newLog: Log = {
              timestamp: timestamp,
              type: ['USER_UPDATED'],
              content: {
                user: {
                  id: userId,
                  username: userDoc.username,
                  gardener: userDoc.gardener,
                },
              },
            };

            batch.update(userRef, {
              ...data,
              profile_picture: picture,
              date_modified: timestamp,
            });
            batch.set(userLog, newLog);

            return batch.commit().then(() => {
              auth.currentUser?.updateProfile({
                displayName: data.username,
                photoURL: picture?.url,
              });
              resetForm();
              console.log('Updated!');
              return history.push('/');
            });
          } catch (error) {
            console.log('error:', error);
            alert(error);
            setStatus(error);
          }

          setSubmitting(false);
        }}
        initialValues={{
          username: userDoc.username,
          first_name: userDoc.first_name,
          last_name: userDoc.last_name,
          profile_picture: userDoc.profile_picture,
          bio: userDoc.bio,
          gardener: userDoc.gardener,
          location: userDoc.location,
          social_media: userDoc.social_media,
          units: '',
        }}>
        {({ isSubmitting, values, status, setFieldValue, errors }) => (
          <Form>
            <TextField
              label='Username'
              name='username'
              placeholder='Display Name'
              type='input'
            />
            <UploadPictureForm
              label='Profile Picture'
              helperText='Select an image for your profile...'
              customRef={`users/${currentUser?.uid}/image`}
              setPicture={setPicture}
              image={picture?.url}
              onComplete={() => {
                console.log('Uploaded');
                setFieldValue('profile_picture', picture);
              }}
            />
            <TextField
              label='First Name '
              name='first_name'
              placeholder='First Name'
              type='input'
            />
            <TextField
              label='Last Name '
              name='last_name'
              placeholder='Last Name'
              type='input'
            />
            <TextArea
              label='Bio'
              name='bio'
              placeholder='Bio'
              type='input'
              rowsMax={3}
            />
            <Selector label='Gardener' name='gardener'>
              <MenuItem value='BEGINNER'>Beginner</MenuItem>
              <MenuItem value='EXPERT'>Expert</MenuItem>
              <MenuItem value='PRO'>Pro</MenuItem>
            </Selector>
            <Selector label='Units' name='units'>
              <MenuItem value='METRIC'>Metric</MenuItem>
              <MenuItem value='IMPERIAL'>Imperial</MenuItem>
            </Selector>
            <TextField
              label='Instagram '
              name='social_media.instragram'
              placeholder='Instagram'
              type='input'
            />
            <TextField
              label='Twitter '
              name='social_media.twitter'
              placeholder='Twitter'
              type='input'
            />
            <TextField
              label='Facebook '
              name='social_media.facebook'
              placeholder='Facebook'
              type='input'
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

export default UpdateProfile;
