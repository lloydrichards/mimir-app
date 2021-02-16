import { Button, MenuItem, Typography } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import firebase from 'firebase';
import { Form, Formik } from 'formik';
import * as React from 'react';
import { PlantProps } from '../../types/PlantType';
import { SpaceType } from '../../types/SpaceType';
import { Selector } from '../Atom-Inputs/Selector';
import { Switch } from '../Atom-Inputs/Switch';
import { TextArea } from '../Atom-Inputs/TextArea';
import { useAuth } from '../auth/Auth';

interface Props {
  space: SpaceType;
  plants: Array<PlantProps & { id: string }>;
  onComplete?: () => void;
  altButton?: { label: string; onClick: () => void };
  debug?: boolean;
}

const WateringForm: React.FC<Props> = ({
  altButton,
  debug,
  space,
  plants,
  onComplete,
}) => {
  const { addWatering } = useAuth();

  return (
    <div>
      <Formik
        onSubmit={async (data, { setStatus, setSubmitting, resetForm }) => {
          setSubmitting(true);
          try {
            const inputPlants = data.plant_ids
              .map((id) => plants.find((plant) => plant.id === id))
              .map((plant) => {
                return {
                  id: plant?.id || '',
                  type: plant?.species.type || 'UNKNOWN',
                  nickname: plant?.nickname || '',
                  botanical_name: plant?.species.id || '',
                  size: plant?.pot.size || 0,
                };
              });

            await addWatering(space, {
              timestamp: firebase.firestore.Timestamp.fromDate(data.timestamp),
              fertilizer: data.fertilizer,
              pictures: [],
              note: data.note,
              plant_ids: data.plant_ids,
              plants: inputPlants,
            });
            resetForm();
            console.log('Watered!');
            onComplete && onComplete();
          } catch (error) {
            console.log('error:', error);
            alert(error);
            setStatus(error);
          }

          setSubmitting(false);
        }}
        initialValues={{
          timestamp: new Date(),
          plant_ids: [] as Array<string>,
          fertilizer: false,
          pictures: [],
          note: { content: '' },
        }}>
        {({ isSubmitting, values, status, errors, setFieldValue }) => (
          <Form>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '120px auto',
                columnGap: '1rem',
                padding: '0.5rem 0',
              }}>
              <Button
                fullWidth
                size='medium'
                variant='outlined'
                onClick={() => setFieldValue('date_created', new Date())}>
                Today
              </Button>
              <KeyboardDatePicker
                disableToolbar
                fullWidth
                variant='inline'
                format='dd/MM/yyyy'
                margin='none'
                id='date-picker-inline'
                label='Watering Date'
                value={values.timestamp}
                onChange={(e: any) => setFieldValue('timestamp', new Date(e))}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '120px auto',
                columnGap: '1rem',

                padding: '0.5rem 0',
              }}>
              <Button
                variant='outlined'
                fullWidth
                onClick={() =>
                  setFieldValue(
                    'plant_ids',
                    plants.map((i) => i.id)
                  )
                }>
                Select All
              </Button>
              <Selector
                placeholder='Select plants'
                label='Plants'
                name='plant_ids'
                multiple>
                <MenuItem disabled value=''>
                  <em>Select plants</em>
                </MenuItem>
                {plants.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nickname || `${p.species.id}`}
                  </MenuItem>
                ))}
              </Selector>
            </div>
            <Switch
              label='Fertilizer'
              name='fertilizer'
              checked={values.fertilizer}
            />
            <TextArea
              label='Note'
              name='note.content'
              placeholder='Any interesting observations...'
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
                Add Watering Log
              </Button>
            </div>

            {status ? <div>{status.message}</div> : null}
            {debug ? (
              <div
                style={{
                  border: '2px dashed lightgrey',
                  background: 'snow',
                  margin: '1rem 0',
                  borderRadius: '1rem',
                  padding: '1rem',
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

export default WateringForm;
