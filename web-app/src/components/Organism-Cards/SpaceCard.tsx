import { Button, Typography } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  COLOUR_LIGHT,
  COLOUR_SECONDARY,
  COLOUR_SUBTLE,
} from '../../Styles/Colours';
import { SpaceConfigProps, SpaceProps } from '../../types/SpaceType';
import ValueField from '../Atom-Inputs/ValueField';
import { RoomTypeMap } from '../Molecule-Data/RoomTypeMap';

interface Props {
  spaceDoc: SpaceProps & { id: string };
  config?: SpaceConfigProps;
}

const SpaceCard: React.FC<Props> = ({ spaceDoc, config }) => {
  const history = useHistory();
  const roomType = RoomTypeMap.find((i) => i.id === spaceDoc.room_type);
  return (
    <div
      style={{
        border: '2px solid lightgrey',
        borderRadius: '1rem',
        padding: '0.5rem',
        margin: '0.5rem 0',
        backgroundColor: COLOUR_LIGHT,
      }}>
      <Typography variant='h5'>{spaceDoc.name}</Typography>
      <div style={{ display: 'grid', gridTemplateColumns: '180px auto 80px' }}>
        {spaceDoc.picture ? (
          <img
            alt={`${spaceDoc.name}`}
            src={spaceDoc.picture.url}
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
          <ValueField
            label='Room Type'
            value={roomType?.field}
            icon={roomType?.icon()}
          />
          <ValueField label='Description' value={spaceDoc.description} />
          <ValueField
            label='Location'
            value={`${spaceDoc.location.city}, ${spaceDoc.location.country}`}
          />
          <ValueField
            label='Light'
            value={spaceDoc.light_direction?.reduce(
              (acc, cur) => cur + ', ' + acc,
              ''
            )}
          />
          <ValueField
            label='Plants'
            value={config ? `${config?.plant_ids.length}` : undefined}
          />
          {config?.devices && (
            <div>
              {config.devices.map((device) => (
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: '1rem',
                    backgroundColor: COLOUR_SECONDARY,
                  }}
                  onDragStart={(e) => console.log('start', e)}
                  onDrop={(e) => console.log('drop', e)}
                  key={device}></div>
              ))}
            </div>
          )}
        </div>
        <div>
          <Button
            size='large'
            variant='outlined'
            fullWidth
            onClick={() => history.push(`/space/${spaceDoc.id}`)}>
            Details
          </Button>
          <Button size='large' variant='outlined' fullWidth>
            Edit
          </Button>
          <Button size='large' variant='outlined' color='secondary' fullWidth>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpaceCard;
