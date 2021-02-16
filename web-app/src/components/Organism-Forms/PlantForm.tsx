import { Button, MenuItem, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { COLOUR_ACCENT } from '../../Styles/Colours';
import { Picture } from '../../types/GenericType';
import {
  FormType,
  PlantProps,
  PotType,
  SpeciesType,
} from '../../types/PlantType';
import { SpaceProps, SpaceType } from '../../types/SpaceType';
import { NumberField } from '../Atom-Inputs/NumberField';
import { Selector } from '../Atom-Inputs/Selector';
import { Switch } from '../Atom-Inputs/Switch';
import { TextArea } from '../Atom-Inputs/TextArea';
import { TextField } from '../Atom-Inputs/TextField';
import { useAuth } from '../auth/Auth';
import { FormTypeMap } from '../Molecule-Data/FormTypeMap';
import { PotTypeMap } from '../Molecule-Data/PotTypeMap';
import { SearchSpecies } from '../Molecule-FormInputs/SpeciesSearch';
import UploadPictureForm from '../Molecule-FormInputs/UploadPictureForm';

interface Props {
  edit?: PlantProps & { id: string };
  addToSpace?: SpaceType;
  spaces?: Array<SpaceProps & { id: string }>;
  altButton?: { label: string; onClick: () => void };
  onComplete?: () => void;
  debug?: boolean;
}
const PlantForm: React.FC<Props> = ({
  spaces,
  altButton,
  debug,
  addToSpace,
  edit,
  onComplete,
}) => {
  const { currentUser, addPlant, editPlant } = useAuth();
  const [userSpaces, setUserSpaces] = useState<
    Array<SpaceProps & { id: string }>
  >(spaces || []);
  const [ownerToggle, setOwnerToggle] = useState<boolean>(true);

  useEffect(() => {
    if (spaces) setUserSpaces(spaces);
  }, [spaces]);
  const [picture, setPicture] = React.useState<Picture | null>(
    edit?.picture || null
  );

  return (
    <div>
      <Formik
        onSubmit={async (data, { setStatus, setSubmitting, resetForm }) => {
          setSubmitting(true);
          const selectedSpace = spaces?.find((i) => i.id === data.space_id);
          const spaceType = addToSpace || {
            id: data.space_id,
            name: selectedSpace?.name || '',
            room_type: selectedSpace?.room_type || 'OTHER',
            light_direction: selectedSpace?.light_direction || [],
            thumb: selectedSpace?.picture?.thumb || '',
          };
          data.picture = picture;
          try {
            edit
              ? editPlant(
                  spaceType,
                  {
                    id: edit.id,
                    type: edit.species.type,
                    botanical_name: edit.species.id,
                    nickname: edit.nickname,
                    size: edit.pot.size,
                  },
                  data
                ).then(() => {
                  console.log('Plant Edited!');
                  setSubmitting(false);
                  resetForm();
                  onComplete && onComplete();
                })
              : addPlant(spaceType, data).then(() => {
                  console.log('Plant Added!');
                  setSubmitting(false);
                  resetForm();
                  onComplete && onComplete();
                });
          } catch (error) {
            console.log('error:', error);
            alert(error);
            setStatus(error);
          }
          setSubmitting(false);
        }}
        initialValues={{
          space_id: addToSpace?.id || '',
          nickname: edit?.nickname || '',
          description: edit?.description || '',
          species: edit?.species || ({} as SpeciesType),
          form: edit?.form || ('' as FormType),
          parent: edit?.parent || {
            name: '',
            id: '',
            owner_name: '',
            owner_id: '',
          },
          picture: edit?.picture || null,
          pot: edit?.pot || {
            hanging: false,
            size: 0,
            tray: true,
            type: '' as PotType,
          },
          owner: edit?.owner || {
            id: currentUser?.uid || '',
            name: currentUser?.displayName || '',
            email: currentUser?.email || '',
          },
        }}>
        {({ isSubmitting, values, status, setFieldValue, errors }) => (
          <Form>
            {!addToSpace && !edit && (
              <Selector
                label='Space'
                name='space_id'
                placeholder='Select Space for plant...'>
                {userSpaces.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
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
              customRef={`plants/image/`}
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
              onChange={(option: any) =>
                setFieldValue('species', option?.value)
              }
            />
            <Selector label='Form' name='form'>
              {FormTypeMap.map((form) => (
                <MenuItem key={form.id} value={form.id}>
                  {form.name}
                </MenuItem>
              ))}
            </Selector>
            <Selector label='Parent' name='parent.id'>
              <MenuItem disabled>No Parents</MenuItem>
            </Selector>
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
                {edit ? 'Save Changes' : 'Add Plant'}
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
