import { Typography } from '@material-ui/core';
import React from 'react';
import SpeciesForm from '../components/Organism-Forms/SpeciesForm';

function PlantEncyclopedia() {
  return (
    <div>
      <div
        style={{
          border: '1px solid lightgrey',
          borderRadius: '0.5rem',
          padding: '1rem',
        }}>
        <Typography align='center' variant='h4'>
          Add Species
        </Typography>
        <SpeciesForm debug />
      </div>
    </div>
  );
}

export default PlantEncyclopedia;
