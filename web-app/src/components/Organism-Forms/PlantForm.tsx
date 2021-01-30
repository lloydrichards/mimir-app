import {
  Button,
  FormControlLabel,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { Form, Formik } from 'formik';
import * as React from 'react';
import { TextField } from '../Atom-Inputs/TextField';
import app, { timestamp } from '../../firebase';
import { TextArea } from '../Atom-Inputs/TextArea';
import { Selector } from '../Atom-Inputs/Selector';
import { useHistory } from 'react-router-dom';
import { UserProps } from '../../types/UserType';
import { Log, Picture } from '../../types/GenericType';
import UploadPictureForm from '../Molecule-FormInputs/UploadPictureForm';
import { NumberField } from '../Atom-Inputs/NumberField';
import { Switch } from '../Atom-Inputs/Switch';
import { COLOUR_ACCENT } from '../../Styles/Colours';
import { PotTypeMap } from '../Molecule-Data/PotTypeMap';
import { useAuth } from '../auth/Auth';
import { FormTypeMap } from '../Molecule-Data/FormTypeMap';

interface Props {}
const db = app.firestore();

const PlantForm: React.FC<Props> = ({}) => {
  const history = useHistory();
  const { currentUser, userDoc } = useAuth();

  const [picture, setPicture] = React.useState<Picture | null>(null);
  const [ownerToggle, setOwnerToggle] = React.useState<boolean>(true);

  const plantDoc = db.collection('mimirPlants').doc();

  return (
    <div>
      <Formik
        onSubmit={async (data, { setStatus, setSubmitting, resetForm }) => {
          const batch = db.batch();

          setSubmitting(true);
          try {
            console.log(data);
            setSubmitting(false);
            resetForm();
          } catch (error) {
            console.log('error:', error);
            alert(error);
            setStatus(error);
          }

          setSubmitting(false);
        }}
        initialValues={{
          nickname: '',
          description: '',
          species: '',
          form: '',
          parent: null,
          picture: null,
          pot: {
            hanging: false,
            size: '',
            tray: true,
            type: '',
          },
          owner: {
            id: currentUser?.uid || null,
            name: currentUser?.displayName || null,
            email: currentUser?.email || null,
          },
        }}>
        {({ isSubmitting, values, status, setFieldValue }) => (
          <Form>
            <TextField
              label='Nickname'
              name='nickanme'
              placeholder='Plants name...'
            />
            <UploadPictureForm
              label='Upload Image'
              helperText='Select an image for the space...'
              customRef={`plants/${plantDoc.id}/image`}
              setPicture={setPicture}
              image={picture?.url}
              onComplete={() => {
                console.log('Uploaded');
                setFieldValue('picture', picture);
              }}
            />
            <TextArea
              label='Description'
              name='description'
              placeholder='Whats the plant like?'
              rowsMax={3}
            />
            <TextField
              label='Species'
              name='species.id'
              placeholder='Display Name'
            />
            <Selector label='Form' name='form'>
              {FormTypeMap.map((form) => (
                <MenuItem key={form.id} value={form.id}>
                  {form.name}
                </MenuItem>
              ))}
            </Selector>
            <Selector label='Parent' name='parent'></Selector>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '180px auto',
                margin: '1rem 0',
                padding: '.8rem',
                border: '1px solid lightgrey',
                borderRadius: '1rem',
              }}>
              <div
                style={{
                  width: 180,
                  height: 180,
                  backgroundColor: COLOUR_ACCENT,
                  borderRadius: '1rem',
                }}
              />
              <div style={{ padding: '0 1rem' }}>
                <Selector label='Pot Type' name='pot.type'>
                  {PotTypeMap.map((pot) => (
                    <MenuItem key={pot.id} value={pot.id}>
                      {pot.name}
                    </MenuItem>
                  ))}
                </Selector>
                <NumberField
                  label='Pot Size'
                  name='pot.size'
                  min={0}
                  max={0}
                  step={0.2}
                  units='Liters'
                />
                <Switch
                  label='Hanging'
                  name='pot.hanging'
                  checked={values.pot.hanging}
                />
                <Switch
                  label='Tray'
                  name='pot.tray'
                  checked={values.pot.tray}
                />
              </div>
            </div>

            <Switch
              label='Owner'
              checked={ownerToggle}
              inputProps={{
                onChange: () => {
                  ownerToggle
                    ? setFieldValue('owner', {
                        id: null,
                        name: '',
                        email: '',
                      })
                    : setFieldValue('owner', {
                        id: currentUser?.uid || null,
                        name: currentUser?.displayName || null,
                        email: currentUser?.email || null,
                      });
                  setOwnerToggle(!ownerToggle);
                },
              }}
              name='ownerToggle'
            />
            {!ownerToggle ? (
              <div
                style={{
                  border: '1px solid lightgrey',
                  borderRadius: '1rem',
                  padding: '1rem',
                }}>
                <TextField
                  name='owner.name'
                  label='Name'
                  placeholder='Name of owner...'
                />
                <TextField
                  name='owner.email'
                  label='Email'
                  placeholder='Email of owner...'
                />
              </div>
            ) : null}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                columnGap: '0.5rem',
              }}>
              <Button variant='outlined' fullWidth>
                Cancel
              </Button>
              <Button
                variant='contained'
                type='submit'
                disabled={isSubmitting}
                fullWidth>
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
              <pre>{JSON.stringify(values, null, 2)}</pre>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PlantForm;
