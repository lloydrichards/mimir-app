import { TextField } from '@material-ui/core';
import { useField, FieldAttributes } from 'formik';

type MySelectProps = { label: string; rowsMax: number } & FieldAttributes<{}>;

export const TextArea: React.FC<MySelectProps> = ({
  label,
  rowsMax,
  placeholder,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <TextField
      fullWidth
      variant="standard"
      multiline
      rows={3}
      rowsMax={rowsMax}
      label={label}
      placeholder={placeholder}
      {...field}
      helperText={errorText}
      error={!!errorText}
    />
  );
};
