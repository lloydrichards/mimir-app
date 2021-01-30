import { FormControlLabel, Switch } from '@material-ui/core';

import { FieldAttributes, useField } from 'formik';

type MySelectProps = {
  label: string;
  checked: boolean;
  inputProps?: any;
} & FieldAttributes<{}>;

const MySwitch: React.FC<MySelectProps> = ({
  label,
  inputProps,
  checked = true,
  ...props
}) => {
  const [field] = useField<{}>(props);
  return (
    <FormControlLabel
      {...field}
      control={<Switch checked={checked} {...inputProps} />}
      label={label}
    />
  );
};

export { MySwitch as Switch };
