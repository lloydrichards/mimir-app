import { Button, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  COLOUR_LIGHT,
  COLOUR_SECONDARY,
  COLOUR_SUBTLE,
} from '../../Styles/Colours';
import { SpaceListItemProps } from '../../types/SpaceType';
import ValueField from '../Atom-Inputs/ValueField';
import { useAuth } from '../auth/Auth';
import { PlantTypesMap } from '../Molecule-Data/PlantTypesMap';
import { RoomTypeMap } from '../Molecule-Data/RoomTypeMap';
import DraggableWrapper from '../Molecule-Wrappers/DraggableWrapper';
import DropWrapper from '../Molecule-Wrappers/DropWrapper';

interface Props {
  space: SpaceListItemProps;
}

const SpaceCard: React.FC<Props> = ({ space }) => {
  const { moveDevice, currentUser, userDoc } = useAuth();
  const history = useHistory();
  const [open, setOpen] = useState<boolean>(false);
  const roomType = RoomTypeMap.find((i) => i.id === space.room_type);

  const handleDrop = (data: any, status: string) => {
    if (space.config.devices.find((i) => i === data))
      return console.log('Do Nothing');
    console.log(`Move ${data} to ${space.name}`);
    moveDevice(data, {
      id: space.id,
      name: space.name,
      light_direction: space.light_direction,
      thumb: space.picture?.thumb || '',
      room_type: space.room_type,
    });
  };
  return (
    <DropWrapper onOpen={setOpen} onDrop={handleDrop} status='okay'>
      <div
        style={{
          border: '2px solid lightgrey',
          borderRadius: '1rem',
          padding: '0.5rem',
          margin: '0.5rem 0',
          backgroundColor: open ? COLOUR_SUBTLE : COLOUR_LIGHT,
        }}>
        <Typography variant='h5'>{space.name}</Typography>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr' }}>
          {space.picture ? (
            <img
              alt={`${space.name}`}
              src={space.picture.url}
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
            <ValueField label='Description' value={space.description} />
            <ValueField
              label='Location'
              value={`${space.location.city}, ${space.location.country}`}
            />
            <ValueField
              label='Light'
              value={space.light_direction?.reduce(
                (acc, cur) => cur + ', ' + acc,
                ''
              )}
            />
            <ValueField
              label='Plants'
              value={
                space.config ? `${space.config?.plant_ids.length}` : undefined
              }
            />
            {space.config?.plants.map((i, idx) => {
              const plantType = PlantTypesMap.find((m) => m.id === i.type);
              return plantType?.icon({ key: idx });
            })}
            {space.config?.devices && (
              <div>
                {space.config.devices.map((device) => (
                  <DraggableWrapper key={device} id={device}>
                    <div
                      style={{
                        padding: '1rem',
                        borderRadius: '1rem',
                        backgroundColor: COLOUR_SECONDARY,
                      }}>
                      {device}
                    </div>
                  </DraggableWrapper>
                ))}
              </div>
            )}
          </div>
          <div>
            <ValueField
              label='Temp'
              value={
                space.readings.length > 0
                  ? `${Math.round(space.readings[0].temperature * 10) / 10} °C`
                  : undefined
              }
            />
            <ValueField
              label='Hum'
              value={
                space.readings.length > 0
                  ? `${Math.round(space.readings[0].humidity)} %`
                  : undefined
              }
            />
            <ValueField
              label='Light'
              value={
                space.readings.length > 0
                  ? `${Math.round(space.readings[0].luminance)} lux`
                  : undefined
              }
            />
            <ValueField
              label='Air'
              value={
                space.readings.length > 0
                  ? `${Math.round(space.readings[0].iaq)} index`
                  : undefined
              }
            />
            <ValueField
              label='Battery'
              value={
                space.readings.length > 0
                  ? `${Math.round(space.readings[0].batteryPercent)} %`
                  : undefined
              }
            />
          </div>
          <div
            style={{ gridColumnStart: 2, gridColumnEnd: 4, display: 'flex' }}>
            <Button
              size='large'
              variant='outlined'
              fullWidth
              onClick={() => history.push(`/space/${space.id}`)}>
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
    </DropWrapper>
  );
};

export default SpaceCard;
