import { Button, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { COLOUR_ACCENT, COLOUR_SUBTLE } from '../../Styles/Colours';
import { PlantProps, PlantType } from '../../types/PlantType';
import { SpaceType } from '../../types/SpaceType';
import ValueField from '../Atom-Inputs/ValueField';
import { PlantTypesMap } from '../Molecule-Data/PlantTypesMap';
import InspectionForm from '../Organism-Forms/InspectionForm';
import PlantForm from '../Organism-Forms/PlantForm';

interface Props {
  space: SpaceType;
  plant: PlantProps & { id: string };
}
const PlantCard: React.FC<Props> = ({ space, plant }) => {
  const [toggleInspection, setToggleInspection] = useState<boolean>(false);
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);

  const plantType: PlantType = {
    id: plant.id,
    nickname: plant.nickname,
    botanical_name: plant.species.id,
    type: plant.species.type,
    size: plant.pot.size,
  };
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 128px',
        columnGap: '1rem',
        background: COLOUR_SUBTLE,
        margin: '0.2rem',
        padding: '1rem',
        borderRadius: '0.5rem',
      }}>
      {toggleEdit ? (
        <PlantForm
          onComplete={() => setToggleEdit(false)}
          addToSpace={space}
          edit={plant}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '180px auto',
            columnGap: '0.5rem',
            background: COLOUR_ACCENT,
            padding: '0.5rem',
            borderRadius: '0.5rem',
          }}>
          {plant.picture ? (
            <img
              alt={`${plant.nickname}`}
              src={plant.picture.url}
              width='100%'
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
          <div>
            <Typography variant='h5'>
              {plant.nickname || plant.species.id}
            </Typography>
            <ValueField label='Description' value={plant.description} />
            <ValueField label='Species' value={plant.species.id} />
            <ValueField
              label='Type'
              icon={PlantTypesMap.find(
                (i) => i.id === plant.species.type
              )?.icon()}
              value={plant.species.type}
            />
            <ValueField
              label='Pot'
              value={`${plant.pot.type} (${plant.pot.size}L)`}
            />
          </div>
        </div>
      )}
      <div>
        <Button
          disabled={toggleInspection}
          size='large'
          variant={toggleEdit ? 'contained' : 'outlined'}
          fullWidth
          onClick={() => {
            setToggleInspection(false);
            setToggleEdit(!toggleEdit);
          }}>
          Edit
        </Button>
        <Button
          disabled={toggleEdit}
          size='large'
          variant={toggleInspection ? 'contained' : 'outlined'}
          fullWidth
          onClick={() => {
            setToggleEdit(false);
            setToggleInspection(!toggleInspection);
          }}>
          Inspection
        </Button>
        <Button disabled size='large' variant='outlined' fullWidth>
          Move
        </Button>
      </div>
      <div>
        {toggleInspection && (
          <InspectionForm
            space={space}
            plant={plantType}
            onComplete={() => setToggleInspection(false)}
            debug
          />
        )}
      </div>
    </div>
  );
};

export default PlantCard;
