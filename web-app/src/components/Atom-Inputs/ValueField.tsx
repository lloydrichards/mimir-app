import { Typography } from '@material-ui/core';
import React from 'react';

interface Props {
  label: string;
  value?: string;
}

const ValueField: React.FC<Props> = ({ label, value }) => {
  return (
    <div style={{ display: 'flex', alignItems: "center" }}>
      <Typography variant='h6'>{label}:</Typography>
      <Typography variant='subtitle1'>{value ? value : '-'}</Typography>
    </div>
  );
};

export default ValueField;
