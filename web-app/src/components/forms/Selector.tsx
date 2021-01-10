import React from 'react';
import { FieldAttributes, useField } from 'formik';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core';
import LocalHotelRoundedIcon from '@material-ui/icons/LocalHotelRounded';
import KitchenRoundedIcon from '@material-ui/icons/KitchenRounded';
import LocalDiningRoundedIcon from '@material-ui/icons/LocalDiningRounded';
import WeekendRoundedIcon from '@material-ui/icons/WeekendRounded';
import TvRoundedIcon from '@material-ui/icons/TvRounded';
import WcRoundedIcon from '@material-ui/icons/WcRounded';
import LaptopChromebookRoundedIcon from '@material-ui/icons/LaptopChromebookRounded';
import EmojiNatureRoundedIcon from '@material-ui/icons/EmojiNatureRounded';
import MenuBookRoundedIcon from '@material-ui/icons/MenuBookRounded';
import DeckRoundedIcon from '@material-ui/icons/DeckRounded';
import LocalFloristRoundedIcon from '@material-ui/icons/LocalFloristRounded';

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
