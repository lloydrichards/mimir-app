import { Typography, Button } from '@material-ui/core';
import React from 'react';
import { COLOUR_SUBTLE } from '../../Styles/Colours';
import { PlantProps } from '../../types/PlantType';
import ValueField from '../Atom-Inputs/ValueField';

interface Props {
  plant: PlantProps & { id: string };
}
const PlantCard: React.FC<Props> = ({ plant }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 180px',
        background: COLOUR_SUBTLE,
        margin: '0.2rem',
        padding: '1rem',
        borderRadius: '0.5rem',
      }}>
      <div>
        <Typography variant='h5'>
          {plant.nickname || plant.species.id}
        </Typography>
        <ValueField label='Description' value={plant.description} />
        <ValueField label='Species' value={plant.species.id} />
        <ValueField
          label='Pot'
          value={`${plant.pot.type} (${plant.pot.size}L)`}
        />
      </div>
      <div>
        <Button fullWidth>Edit</Button>
      </div>
    </div>
  );
};

export default PlantCard;
