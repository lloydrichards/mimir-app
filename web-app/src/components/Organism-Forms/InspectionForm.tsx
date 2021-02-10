import { Button, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import * as React from 'react';
import { TextField } from '../Atom-Inputs/TextField';
import app from '../../firebase';
import { useHistory } from 'react-router-dom';
import { Switch } from '../Atom-Inputs/Switch';
import { Selector } from '../Atom-Inputs/Selector';
import { TextArea } from '../Atom-Inputs/TextArea';
import { Slider } from '../Atom-Inputs/Slider';

interface Props {
  altButton?: { label: string; onClick: () => void };
  debug?: boolean;
}
const db = app.firestore();

const basicForm: React.FC<Props> = ({ altButton, debug }) => {
  const history = useHistory();
  return (
    <div>
      <Formik
        onSubmit={async (data, { setStatus, setSubmitting, resetForm }) => {
          const batch = db.batch();

          setSubmitting(true);
          try {
            console.log(data);
          } catch (error) {
            console.log('error:', error);
            alert(error);
            setStatus(error);
          }

          setSubmitting(false);
        }}
        initialValues={{
          happiness: 0,
          health: 0,
          leafing: false,
          flowering: false,
          fruiting: false,
          root_bound: false,
          problems: [],
          pests: [],
          pictures: [],
          note: { content: '' },
        }}>
        {({ isSubmitting, values, status, errors }) => (
          <Form>
            <Slider
              label='Happiness'
              name='happiness'
              inputProps={{ max: 1, min: 0, step: 0.1 }}
            />
            <Slider
              label='Healthy'
              name='health'
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
              placeholder='Any problems with the plant?'></Selector>
            <Selector
              name='pests'
              label='Pests'
              placeholder='Any pests on the plant?'></Selector>
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

export default basicForm;
