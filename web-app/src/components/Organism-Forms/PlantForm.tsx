import { Button, MenuItem, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import * as React from 'react';
import { TextField } from '../Atom-Inputs/TextField';
import app, { timestamp } from '../../firebase';
import { TextArea } from '../Atom-Inputs/TextArea';
import { Selector } from '../Atom-Inputs/Selector';
import { Log, Picture } from '../../types/GenericType';
import UploadPictureForm from '../Molecule-FormInputs/UploadPictureForm';
import { NumberField } from '../Atom-Inputs/NumberField';
import { Switch } from '../Atom-Inputs/Switch';
import { COLOUR_ACCENT, COLOUR_DARK } from '../../Styles/Colours';
import { PotTypeMap } from '../Molecule-Data/PotTypeMap';
import { useAuth } from '../auth/Auth';
import { FormTypeMap } from '../Molecule-Data/FormTypeMap';
import { SearchSpecies } from '../Molecule-FormInputs/SpeciesSearch';
import { SpaceConfigProps, SpaceProps } from '../../types/SpaceType';
import { useState, useEffect } from 'react';
import { RoomTypeMap } from '../Molecule-Data/RoomTypeMap';
import { FormType, PlantProps, PotType } from '../../types/PlantType';

interface Props {
  addToSpace?: string;
  spaces?: Array<SpaceProps & { id: string }>;
  altButton?: { label: string; onClick: () => void };
  debug?: boolean;
}
const db = app.firestore();

const PlantForm: React.FC<Props> = ({
  spaces,
  altButton,
  debug,
  addToSpace,
}) => {
  const { currentUser } = useAuth();
  const [userSpaces, setUserSpaces] = useState<
    Array<SpaceProps & { id: string }>
  >(spaces || []);

  useEffect(() => {
    if (spaces) setUserSpaces(spaces);
  }, [spaces]);
  const [picture, setPicture] = React.useState<Picture | null>(null);
  const [ownerToggle, setOwnerToggle] = React.useState<boolean>(true);

  const plantDoc = db.collection('mimirPlants').doc();

  return (
    <div>
      <Formik
        onSubmit={async (data, { setStatus, setSubmitting, resetForm }) => {
          const userRef = db
            .collection('mimirUsers')
            .doc(currentUser?.uid || '');
          const plantRef = db.collection('mimirPlants').doc();
          const spaceRef = db.collection('mimirSpaces').doc(data.space_id);

          const userLog = userRef.collection('Logs').doc();
          const spaceLog = spaceRef.collection('Logs').doc();
          const plantLog = plantRef.collection('Logs').doc();

          const newLog: Log = {
            timestamp,
            type: ['PLANT_CREATED', 'SPACE_UPDATED', 'USER_UPDATED'],
            content: {},
          };
          setSubmitting(true);
          try {
            return db
              .runTransaction(async (t) => {
                const currentConfig = spaceRef
                  .collection('Configs')
                  .where('current', '==', true)
                  .orderBy('timestamp', 'desc');
                const newConfigRef = spaceRef.collection('Configs').doc();

                const currentConfigDoc = await currentConfig.get();
                if (currentConfigDoc.empty) throw { error: 'No Configs' };

                const currentDoc = currentConfigDoc.docs[0].data() as SpaceConfigProps;
                const newConfig: SpaceConfigProps = {
                  ...currentDoc,
                  plant_ids: currentDoc.plant_ids.concat(plantRef.id),
                  plants: [
                    ...currentDoc.plants,
                    {
                      id: plantRef.id,
                      nickname: data.nickname,
                      type: data.form,
                      botanical_name: data.species.id,
                      size: `${data.pot.size}`,
                    },
                  ],
                };

                const newPlantDoc: PlantProps = {
                  date_created: timestamp,
                  nickname: data.nickname,
                  date_modified: null,
                  alive: true,
                  description: data.description,
                  form: data.form,
                  owner: data.owner,
                  parent: data.parent,
                  pot: data.pot,
                  picture: data.picture,
                  roles: {
                    [currentUser?.uid || '']: 'ADMIN',
                  },
                  species: data.species,
                };

                t.set(plantRef, newPlantDoc);
                t.set(newConfigRef, newConfig);
                t.set(userLog, newLog);
                t.set(spaceLog, newLog);
                t.set(plantLog, newLog);

                currentConfigDoc.docs.forEach((doc) =>
                  t.update(doc.ref, { current: false })
                );
              })
              .then(() => {
                console.log('Success!');
                setSubmitting(false);
                resetForm();
              });
          } catch (error) {
            console.log('error:', error);
            alert(error);
            setStatus(error);
          }

          setSubmitting(false);
        }}
        initialValues={{
          space_id: addToSpace || '',
          nickname: '',
          description: '',
          species: {
            family: '',
            genus: '',
            species: '',
            subspecies: '',
            cultivar: '',
            id: '',
          },
          form: '' as FormType,
          parent: null,
          picture: null,
          pot: {
            hanging: false,
            size: 0,
            tray: true,
            type: '' as PotType,
          },
          owner: {
            id: currentUser?.uid || '',
            name: currentUser?.displayName || '',
            email: currentUser?.email || '',
          },
        }}>
        {({ isSubmitting, values, status, setFieldValue, errors }) => (
          <Form>
            {!addToSpace && (
              <Selector
                label='Space'
                name='space_id'
                placeholder='Select Space for plant...'>
                {userSpaces.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {RoomTypeMap.find((i) => i.id === s.room_type)?.icon(
                      {},
                      COLOUR_DARK
                    )}
                    {s.name}
                  </MenuItem>
                ))}
              </Selector>
            )}

            <TextField
              label='Nickname'
              name='nickname'
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
            <SearchSpecies
              initialValue=''
              onChange={(option: any) => setFieldValue('species', option.value)}
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

export default PlantForm;
