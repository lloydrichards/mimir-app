import { Button, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import UploadProgressBar from '../Atom-Inputs/UploadProgressBar';
import { Picture } from '../../types/GenericType';
import { COLOUR_SUBTLE } from '../../Styles/Colours';

interface Props {
  setPicture: React.Dispatch<React.SetStateAction<Picture | null>>;
  customRef?: string;
  image?: string;
  helperText: string;
  label: string;
  onComplete: () => void;
}
const UploadPictureForm: React.FC<Props> = ({
  setPicture,
  customRef,
  onComplete,
  image,
  helperText,
  label,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const types = ['image/png', 'image/jpeg'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    const selected = e.target.files ? e.target.files[0] : null;
    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError(null);
    } else {
      setFile(null);
      setError('Invalid Error Type');
    }
  };
  return (
    <div
      style={{
        border: '1px solid lightgrey',
        borderRadius: '1rem',
        padding: '1rem 0.5rem',
        margin: '1rem 0',
      }}>
      <Typography variant='subtitle1' color='textSecondary'>
        {label}
      </Typography>
      <div style={{ display: 'flex' }}>
        {image ? (
          <img
            alt={label}
            src={image}
            height='180'
            width='180'
            style={{ borderRadius: '1rem' }}></img>
        ) : (
          <div
            style={{
              borderRadius: '1rem',
              width: 180,
              height: 180,
              backgroundColor: COLOUR_SUBTLE,
            }}
          />
        )}
        <div style={{ padding: '1rem' }}>
          <Typography>{helperText}</Typography>
          <Button variant='contained' component='label'>
            Upload File
            <input type='file' hidden onChange={handleChange} />
          </Button>
          <div>
            {error && <Typography color='error'>{error}</Typography>}
            {file && (
              <Typography>
                {file.name} ({Math.round(file.size / 10000) / 100}MB)
              </Typography>
            )}
          </div>
          {file && (
            <UploadProgressBar
              path={customRef}
              file={file}
              setFile={setFile}
              setPicture={setPicture}
              onComplete={onComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPictureForm;
