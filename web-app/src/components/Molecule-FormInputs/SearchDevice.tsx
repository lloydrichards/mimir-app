import * as React from 'react';
import { TextField } from '@material-ui/core';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import { useField, FieldAttributes, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  mergeMap,
  tap,
} from 'rxjs/operators';
import app from '../../firebase';
import useObservable from '../helper/useObservable';
import { docData } from 'rxfire/firestore';

type MySelectProps = { label: string } & FieldAttributes<{}>;

const db = app.firestore();

let searchSubject = new BehaviorSubject('');
let searchResultObservable = searchSubject.pipe(
  filter((val) => val.length > 10),
  debounceTime(750),
  distinctUntilChanged(),
  mergeMap((v) =>
    docData(db.collection('mimirDevices').doc(v), 'id').pipe(
      tap(() => console.log('Fired'))
    )
  )
);

export const SearchDevice: React.FC<MySelectProps> = ({
  label,
  placeholder,
  ...props
}) => {
  const [search, setSearch] = useState<string>();
  const [results, setResults] = useState<any | null>(null);
  const [found, setFound] = useState<boolean>(false);

  useObservable(searchResultObservable, setResults);

  const [field, meta] = useField<{}>(props);
  const { setFieldValue } = useFormikContext();
  const errorText = meta.error && meta.touched ? meta.error : '';
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    await searchSubject.next(newValue);
  };
  useEffect(() => {
    if (results && results.date_created) {
      console.log(results);
      setFieldValue(field.name, results.id);
      setFound(true);
    } else {
      setFieldValue(field.name, '');
      setFound(false);
    }
  }, [setFieldValue, results, field.name]);

  return (
    <TextField
      fullWidth
      label={label}
      value={search}
      placeholder={placeholder}
      onChange={handleChange}
      error={!!errorText}
      helperText={!!errorText ? errorText : found ? 'Device Found!' : null}
      InputProps={{
        startAdornment: <SearchRoundedIcon />,
      }}
    />
  );
};
