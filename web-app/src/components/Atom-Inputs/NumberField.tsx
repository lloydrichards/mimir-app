import { TextField, InputAdornment } from '@material-ui/core';
import { FieldAttributes, useField } from 'formik';

type MySelectProps = {
  min: number;
  max: number;
  step: number;
  label?: string;
  InputProps?: any;
  units?: string;
} & FieldAttributes<{}>;

const MyNumberField: React.FC<MySelectProps> = ({
  label,
  placeholder,
  units,
  InputProps,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <div style={{ margin: '4px 0px' }}>
      <TextField
        fullWidth
        type='number'
        label={label}
        placeholder={placeholder}
        {...field}
        helperText={errorText}
        error={!!errorText}
        InputProps={{
          ...InputProps,
          startAdornment: (
            <InputAdornment position='start'>{units}</InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export { MyNumberField as NumberField };
