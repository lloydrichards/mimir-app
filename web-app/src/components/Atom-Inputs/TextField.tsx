import { TextField } from '@material-ui/core';
import { FieldAttributes, useField } from 'formik';

type MySelectProps = { label?: string; InputProps?: any } & FieldAttributes<{}>;

const MyTextField: React.FC<MySelectProps> = ({
  label,
  placeholder,
  InputProps,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <div style={{margin:"4px 0px"}}>
      <TextField
        fullWidth
        label={label}
        placeholder={placeholder}
        {...field}
        helperText={errorText}
        error={!!errorText}
        InputProps={InputProps}
      />
    </div>
  );
};

export { MyTextField as TextField };
