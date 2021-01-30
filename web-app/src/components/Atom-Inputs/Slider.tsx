import { Grid, Input, Slider, Typography } from '@material-ui/core';

import { FieldAttributes, useField } from 'formik';
import React from 'react';

type MySelectProps = {
  label: string;
  inputProps: { step: number; min: number; max: number };
} & FieldAttributes<{}>;

const MySlider: React.FC<MySelectProps> = ({
  label,
  inputProps,
  children,
  ...props
}) => {
  const [field, meta, helpers] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <div style={{ margin: '4px 0px' }}>
      <Typography variant='overline' id='input-slider' gutterBottom>
        {label}
      </Typography>
      <Grid container spacing={4} alignItems='center'>
        {children ? <Grid item>{children}</Grid> : null}
        <Grid item xs>
          <Slider
            value={typeof field.value === 'number' ? field.value : 0}
            onChange={(e, v) => helpers.setValue(v)}
            aria-labelledby='input-slider'
            {...inputProps}
          />
        </Grid>
        <Grid item xs={2}>
          <Input
            {...field}
            style={{ fontSize: '1.5rem' }}
            margin='dense'
            inputProps={{
              ...inputProps,
              type: 'number',
              style: { textAlign: 'center' },
              'aria-labelledby': 'input-slider',
            }}
            error={!!errorText}
          />
          <p>{!!errorText ? errorText : null}</p>
        </Grid>
      </Grid>
    </div>
  );
};

export { MySlider as Slider };
