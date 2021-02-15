import { Button, MenuItem, Typography } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import firebase from 'firebase';
import { Form, Formik } from 'formik';
import * as React from 'react';
import app from '../../firebase';
import { Log } from '../../types/LogType';
import { PlantProps } from '../../types/PlantType';
import { SpaceType } from '../../types/SpaceType';
import { WateringProps } from '../../types/WateringType';
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
const db = app.firestore();

const WateringForm: React.FC<Props> = ({
  altButton,
  debug,
  space,
  plants,
  onComplete,
}) => {
  const { currentUser, userDoc } = useAuth();

  return (
    <div>
      <Formik
        onSubmit={async (data, { setStatus, setSubmitting, resetForm }) => {
          const batch = db.batch();
          const userRef = db
            .collection('mimirUsers')
            .doc(currentUser?.uid || '');
          const spaceRef = db.collection('mimirSpaces').doc(space.id);
          const plantRefs = data.plant_ids.map((i) =>
            db.collection('mimirPlants').doc(i)
          );
          const wateringRef = db.collection('mimirWaterings').doc();

          const userLog = userRef.collection('Logs').doc();
          const spaceLog = spaceRef.collection('Logs').doc();
          setSubmitting(true);
          try {
            const newWateringDoc: WateringProps = {
              ...data,
              date_created: firebase.firestore.Timestamp.fromDate(
                new Date(data.date_created)
              ),
              created_by: {
                id: currentUser?.uid || '',
                username: userDoc?.username || '',
                gardener: userDoc?.gardener || 'BEGINNER',
              },
              space,
              plants: data.plant_ids
                .map((id) => plants.find((plant) => plant.id === id))
                .map((plant) => {
                  return {
                    id: plant?.id || '',
                    type: plant?.species.type || 'UNKNOWN',
                    nickname: plant?.nickname || '',
                    botanical_name: plant?.species.id || '',
                    size: plant?.pot.size || 0,
                  };
                }),
            };
            const newLog: Log = {
              timestamp: firebase.firestore.Timestamp.fromDate(
                new Date(data.date_created)
              ),
              type: ['WATERING', 'SPACE_UPDATED'],
              content: {},
            };

            batch.set(wateringRef, newWateringDoc);
            batch.set(userLog, newLog);
            batch.set(spaceLog, newLog);
            plantRefs.forEach((ref) =>
              batch.set(ref.collection('Logs').doc(), newLog)
            );

            return batch.commit().then(() => {
              resetForm();
              console.log('Watered!');
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
          date_created: new Date(),
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
                value={values.date_created}
                onChange={(e: any) =>
                  setFieldValue('date_created', new Date(e))
                }
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
