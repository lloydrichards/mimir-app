import { TextField } from '@material-ui/core';
import { FieldAttributes, useField } from 'formik';

type MySelectProps = {
  label?: string;
  type?: string;
  InputProps?: any;
} & FieldAttributes<{}>;

const MyTextField: React.FC<MySelectProps> = ({
  label,
  placeholder,
  InputProps,
  type,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <div style={{ margin: '4px 0px' }}>
      <TextField
        fullWidth
        type={type}
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
