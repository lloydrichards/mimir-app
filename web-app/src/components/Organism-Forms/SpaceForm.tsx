import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Typography,
} from '@material-ui/core';
import firebase from 'firebase';
import { FieldArray, Form, Formik } from 'formik';
import * as React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { useHistory } from 'react-router-dom';
import {
  COLOUR_DARK,
  COLOUR_LIGHT,
  COLOUR_SECONDARY,
  COLOUR_SUBTLE,
} from '../../Styles/Colours';
import { Location, Picture } from '../../types/GenericType';
import {
  RoomType,
  SpaceInput,
  SpaceProps,
  SpaceType,
} from '../../types/SpaceType';
import { Selector } from '../Atom-Inputs/Selector';
import { Switch } from '../Atom-Inputs/Switch';
import { TextArea } from '../Atom-Inputs/TextArea';
import { TextField } from '../Atom-Inputs/TextField';
import ValueField from '../Atom-Inputs/ValueField';
import { useAuth } from '../auth/Auth';
import { countryLookUp } from '../Molecule-Data/CountryLookUp';
import { LightDirectionMap } from '../Molecule-Data/LightDirectionMap';
import { RoomTypeMap } from '../Molecule-Data/RoomTypeMap';
import UploadPictureForm from '../Molecule-FormInputs/UploadPictureForm';

interface Props {
  edit?: SpaceProps & { id: string };
  onComplete?: () => void;
  altButton?: { label: string; onClick: () => void };
  debug?: boolean;
}

const SpaceForm: React.FC<Props> = ({ altButton, debug, edit, onComplete }) => {
  const history = useHistory();
  const { currentUser, addSpace, editSpace } = useAuth();
  const [ownerToggle, setOwnerToggle] = React.useState<boolean>(true);
  const [address, setAddress] = React.useState<string>('');
  const [location, setLocation] = React.useState<Location>(
    edit?.location || {
      city: '',
      country: '',
      geo: new firebase.firestore.GeoPoint(0, 0),
      region: '',
    }
  );
  const [picture, setPicture] = React.useState<Picture | null>(
    edit?.picture || null
  );

  const handleSelect = async (value: string) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);

    const geo = new firebase.firestore.GeoPoint(latLng.lat, latLng.lng);
    setAddress(value);
    const city = results[0].address_components.find((i) =>
      i.types.includes('locality')
    );
    const country = results[0].address_components.find((i) =>
      i.types.includes('country')
    );
    const _region = countryLookUp.find(
      (i) => i.country === (country?.long_name || country?.short_name)
    );

    const region = _region?.intermediate_region_name
      ? _region?.intermediate_region_name
      : _region?.subregion_name
      ? _region?.subregion_name
      : _region?.region_name;

    setLocation({
      region: region || '',
      country: country?.long_name || country?.short_name || '',
      city: city?.long_name || city?.short_name || '',
      geo,
    });
  };

  return (
    <div>
      <Formik
        onSubmit={async (data, { setStatus, setSubmitting, resetForm }) => {
          const space: SpaceType = {
            id: edit?.id || '',
            name: edit?.name || '',
            light_direction: edit?.light_direction || [],
            room_type: edit?.room_type || 'OTHER',
            thumb: edit?.picture?.thumb || '',
          };
          data.picture = picture;
          try {
            edit
              ? editSpace(space, { ...data, location }).then(() => {
                  resetForm();
                  setSubmitting(true);
                  onComplete && onComplete();
                })
              : addSpace({ ...data, location }).then(() => {
                  resetForm();
                  setSubmitting(true);
                  onComplete ? onComplete() : history.push('/');
                });
          } catch (error) {
            console.log('error:', error);
            alert(error);
            setStatus(error);
          }

          setSubmitting(false);
        }}
        initialValues={
          {
            name: edit?.name || '',
            description: edit?.description || '',
            room_type: edit?.room_type || ('' as RoomType),
            light_direction: edit?.light_direction || ([] as Array<string>),
            picture,
            location,
            owner: edit?.owner || {
              id: '',
              name: '',
              email: '',
            },
          } as SpaceInput
        }>
        {({ isSubmitting, values, status, setFieldValue, errors }) => (
          <Form>
            <TextField
              label='Space Name'
              name='name'
              placeholder='Enter what the space is called...'
            />
            <UploadPictureForm
              label='Upload Image'
              helperText='Select an image for the space...'
              customRef={`spaces/image/`}
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
              placeholder='Short description of the space...'
              rowsMax={5}
            />
            <Selector label='Room Type' name='room_type'>
              {RoomTypeMap.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.icon({}, COLOUR_LIGHT)}
                  {room.field}
                </MenuItem>
              ))}
            </Selector>
            <FieldArray name='light_direction'>
              {(arrayHelper) => {
                return (
                  <FormControl component='fieldset'>
                    <FormLabel component='legend'>Light Direction</FormLabel>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateRows: '5rem 5rem',
                        gridTemplateColumns: '5rem 5rem',
                        columnGap: '0.5rem',
                        rowGap: '0.5rem',
                        gridTemplateAreas: "'NW N NE' 'W centre E' 'SW S SE'",
                      }}>
                      {LightDirectionMap.map((sun) => (
                        <FormControlLabel
                          key={sun.id}
                          control={
                            <Checkbox
                              icon={sun.icon({}, COLOUR_SUBTLE)}
                              checked={values.light_direction.includes(sun.id)}
                              checkedIcon={sun.icon({}, COLOUR_DARK)}
                              name={sun.id}
                              onChange={(e, v) =>
                                values.light_direction.includes(sun.id)
                                  ? arrayHelper.remove(
                                      values.light_direction.indexOf(sun.id)
                                    )
                                  : arrayHelper.push(sun.id)
                              }
                            />
                          }
                          label={sun.field}
                          labelPlacement='bottom'
                          style={{
                            color: values.light_direction.includes(sun.id)
                              ? COLOUR_DARK
                              : COLOUR_SUBTLE,
                            border: '1px solid',
                            margin: '0.2rem',
                            width: '5rem',
                            height: '5rem',
                            borderRadius: '.8rem 0.2px',
                            gridArea: sun.id,
                          }}
                        />
                      ))}
                    </div>
                  </FormControl>
                );
              }}
            </FieldArray>

            <PlacesAutocomplete
              value={address}
              onChange={setAddress}
              onSelect={(value) => {
                handleSelect(value);
                setFieldValue('location', location);
              }}>
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div>
                  <input {...getInputProps()} />
                  <div>{loading ? <div>...loading</div> : null}</div>
                  <div>
                    {suggestions.map((suggestion) => (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          key: suggestion.id,
                          style: {
                            color: suggestion.active
                              ? COLOUR_SECONDARY
                              : 'black',
                            cursor: 'pointer',
                          },
                        })}>
                        {suggestion.description}
                      </div>
                    ))}
                  </div>
                  <ValueField label='Region' value={location?.region} />
                  <ValueField label='Country' value={location?.country} />
                  <ValueField label='City' value={location?.city} />
                  <ValueField
                    label='Geo'
                    value={
                      location
                        ? `${location?.geo?.latitude}, ${location?.geo?.longitude}`
                        : undefined
                    }
                  />
                </div>
              )}
            </PlacesAutocomplete>
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
                {edit ? 'Save Changes' : 'Add Space'}
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

export default SpaceForm;
