import * as React from 'react';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useField, FieldAttributes } from 'formik';

type MySelectProps = { label: string } & FieldAttributes<{}>;

export const PasswordField: React.FC<MySelectProps> = ({
  label,
  placeholder,
  ...props
}) => {
  const [showPassword, setPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <TextField
      fullWidth
      label={label}
      placeholder={placeholder}
      {...field}
      error={!!errorText}
      type={showPassword ? 'password' : 'text'}
      helperText={errorText}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}>
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
