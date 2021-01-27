import { TextField } from '@material-ui/core';
import { FieldAttributes, useField } from 'formik';

type MySelectProps = { label?: string } & FieldAttributes<{}>;

const MyTextField: React.FC<MySelectProps> = ({
  label,
  placeholder,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <TextField
      fullWidth
      label={label}
      placeholder={placeholder}
      {...field}
      helperText={errorText}
      error={!errorText}
    />
  );
};

export { MyTextField as TextField };
