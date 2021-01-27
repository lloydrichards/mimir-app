import { FormControlLabel, Switch } from '@material-ui/core';

import { FieldAttributes, useField } from 'formik';

type MySelectProps = { label: string; checked: boolean } & FieldAttributes<{}>;

const MyNumberPicker: React.FC<MySelectProps> = ({
  label,
  checked = true,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <FormControlLabel {...field} control={<Switch checked={checked} />} label={label} />
  );
};

export { MyNumberPicker as NumberPicker };
