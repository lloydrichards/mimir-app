import { Button, MenuItem, Typography } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import firebase from 'firebase';
import { Form, Formik } from 'formik';
import * as React from 'react';
import { PlantType } from '../../types/PlantType';
import { SpaceType } from '../../types/SpaceType';
import { Selector } from '../Atom-Inputs/Selector';
import { Slider } from '../Atom-Inputs/Slider';
import { Switch } from '../Atom-Inputs/Switch';
import { TextArea } from '../Atom-Inputs/TextArea';
import { useAuth } from '../auth/Auth';
import { PestTypesMap } from '../Molecule-Data/PestTypesMap';
import { PromblemTypesMap } from '../Molecule-Data/PromblemTypesMap';


interface Props {
  space: SpaceType;
  plant: PlantType;
  onComplete?: () => void;
  altButton?: { label: string; onClick: () => void };
  debug?: boolean;
}

const InspectionForm: React.FC<Props> = ({
  space,
  plant,
  altButton,
  debug,
  onComplete,
}) => {
  const { addInspection } = useAuth();
  return (
    <div>
      <Formik
        onSubmit={async (data, { setStatus, setSubmitting, resetForm }) => {
          const health =
            (data.leafing ? 2 : 0) +
            (data.flowering ? 3 : 0) +
            (data.fruiting ? 5 : 0) +
            (data.root_bound ? -5 : 0) +
            data.problems.length * -1 +
            data.pests.length * -2;
          setSubmitting(true);
          try {
            await addInspection(space, plant, {
              timestamp: firebase.firestore.Timestamp.fromDate(data.timestamp),
              happiness: data.happiness,
              health,
              leafing: data.leafing,
              flowering: data.flowering,
              fruiting: data.fruiting,
              root_bound: data.root_bound,
              pests: data.pests,
              problems: data.problems,
              note: data.note,
              pictures: [],
            });
            console.log(health);
            resetForm();
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
          happiness: 0,
          leafing: false,
          flowering: false,
          fruiting: false,
          root_bound: false,
          problems: [],
          pests: [],
          pictures: [],
          note: { content: '' },
        }}>
        {({ isSubmitting, values, status, errors, setFieldValue }) => (
          <Form>
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
            <Slider
              label='Happiness'
              name='happiness'
              inputProps={{ max: 1, min: 0, step: 0.1 }}
            />
            <Switch name='leafing' label='Leafing' checked={values.leafing} />
            <Switch
              name='flowering'
              label='Flowering'
              checked={values.flowering}
            />
            <Switch
              name='fruiting'
              label='Fruiting'
              checked={values.fruiting}
            />
            <Switch
              name='root_bound'
              label='Root Bound'
              checked={values.root_bound}
            />
            <Selector
              name='problems'
              label='Problems'
              multiple
              placeholder='Any problems with the plant?'>
              {PromblemTypesMap.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Selector>
            <Selector
              name='pests'
              label='Pests'
              multiple
              placeholder='Any pests on the plant?'>
              {PestTypesMap.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Selector>
            <TextArea
              name='note.content'
              label='Note'
              placeholder='Any observations...'
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
                Add Inspection
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
              {debug ? (
                <div>
                  <pre>{JSON.stringify(values, null, 2)}</pre>
                  <pre>{JSON.stringify(errors, null, 2)}</pre>
                </div>
              ) : null}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default InspectionForm;
