import React from 'react';
import { FieldAttributes, useField } from 'formik';
import {
  Select,
  FormControl,
  InputLabel,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      width: '100%',
    },
    selectEmpty: {
      marginTop: theme.spacing(1),
    },
  })
);

type Props = { label: string } & FieldAttributes<{}>;

export const Selector: React.FC<Props> = ({
  label,
  placeholder,
  children,
  ...props
}) => {
  const [field] = useField<{}>(props);
  const classes = useStyles();
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id='demo-simple-select-label'>{label}</InputLabel>
      <Select
        id='demo-simple-select'
        labelId='demo-simple-select-label'
        {...field}
        placeholder={placeholder}>
        {children}
      </Select>
    </FormControl>
  );
};
