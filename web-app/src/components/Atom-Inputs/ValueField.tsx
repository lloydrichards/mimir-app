import { Typography } from '@material-ui/core';
import React from 'react';
import { COLOUR_DARK } from '../../Styles/Colours';

interface Props {
  label: string;
  value?: string;
  icon?: JSX.Element;
}

const ValueField: React.FC<Props> = ({ label, value, icon }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant='h6' style={{ margin: '0 0.5rem' }}>
        {label}:
      </Typography>
      {icon && <div style={{ margin: '0 0.5rem 0 0 ' }}>{icon}</div>}
      <Typography variant='subtitle1' style={{ color: COLOUR_DARK }}>
        {value ? value : '-'}
      </Typography>
    </div>
  );
};

export default ValueField;
