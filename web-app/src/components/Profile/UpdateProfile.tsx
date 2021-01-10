import { Button, MenuItem } from '@material-ui/core';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import * as yup from 'yup';
import { PasswordField } from '../forms/PasswordField';
import { TextField } from '../forms/TextField';
import { useAuth } from '../auth/Auth';
import app from '../../firebase';
import Login from '../auth/Login';
import { UserProps } from '../../types/UserType';
import { TextArea } from '../forms/TextArea';
import { Selector } from '../forms/Selector';
import { updateProfile } from '../dispatchers/updateProfile';

interface Props {
  userId: string;
  userDoc: UserProps;
}
const db = app.firestore();

const UpdateProfile: React.FC<Props> = ({ userId, userDoc }) => {
  return (
    <div>
      <Formik
        onSubmit={async (data, { setStatus, setSubmitting, resetForm }) => {
          setSubmitting(true);
          try {
            await updateProfile(userId, data).then((i) => console.log(i));
            resetForm();
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
          bio: userDoc.bio,
          gardener: userDoc.gardener,
          units: userDoc.units,
          location: userDoc.location,
          social_media: userDoc.social_media,
        }}>
        {({ isSubmitting, values, status }) => (
          <Form>
            <TextField
              label='Username'
              name='username'
              placeholder='Display Name'
              type='input'
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

            <Button variant='contained' type='submit' disabled={isSubmitting}>
              Update
            </Button>
            <Button variant='outlined'>Cancel</Button>
            {status ? <div>{status.message}</div> : null}
            <pre>{JSON.stringify(values, null, 2)}</pre>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdateProfile;
