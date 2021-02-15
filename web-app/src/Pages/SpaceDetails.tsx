import { Button, Typography } from '@material-ui/core';
import React, { useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { docData } from 'rxfire/firestore';
import ValueField from '../components/Atom-Inputs/ValueField';
import { spaceDetails } from '../components/helper/Operators/spaceDetails';
import useObservable from '../components/helper/useObservable';
import { RoomTypeMap } from '../components/Molecule-Data/RoomTypeMap';
import PlantCard from '../components/Organism-Cards/PlantCard';
import PlantForm from '../components/Organism-Forms/PlantForm';
import WateringForm from '../components/Organism-Forms/WarteringForm';
import app from '../firebase';
import { COLOUR_ACCENT } from '../Styles/Colours';
import { PlantProps } from '../types/PlantType';
import { DailyProps } from '../types/ReadingType';
import {
  SpaceAggProps,
  SpaceConfigProps,
  SpaceProps,
} from '../types/SpaceType';

type Props = {} & Partial<RouteComponentProps<{ space_id: string }>>;

const db = app.firestore();

const SpaceDetails: React.FC<Props> = ({ match }) => {
  const space_id = match?.params.space_id;

  const [toggleAddPlant, setToggleAddPlant] = useState<boolean>(false);
  const [toggleWatering, setToggleWatering] = useState<boolean>(false);
  const [space, setSpace] = useState<
    SpaceProps & {
      id: string;
      config: SpaceConfigProps & { id: string };
      aggs: SpaceAggProps & { id: string };
      plants: Array<PlantProps & { id: string }>;
      daily: Array<DailyProps & { id: string }>;
    }
  >();

  const spaceData$ = useMemo(
    () =>
      docData(db.collection('mimirSpaces').doc(space_id), 'id').pipe(
        spaceDetails(db)
      ),
    [space_id]
  );
  useObservable(spaceData$, setSpace);

  const roomType = RoomTypeMap.find((i) => i.id === space?.room_type || '');
  if (!space) {
    return <Typography>Loading</Typography>;
  } else
    return (
      <div>
        <Typography variant='h4'>Space Details</Typography>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <ValueField label='ID' value={space_id || ''} />
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
          </div>
          {space.daily.length > 0 && (
            <div>
              <ValueField
                label='Temp'
                value={`${
                  Math.round(space.daily[0].temperature.avg * 100) / 100
                }°C`}
              />
              <ValueField
                label='Hum'
                value={`${
                  Math.round(space.daily[0].humidity.avg * 100) / 100
                }%`}
              />
              <ValueField
                label='Light'
                value={`${Math.round(space.daily[0].light.avg)} lux`}
              />
              <ValueField
                label='Air'
                value={`${Math.round(space.daily[0].air.avg)}`}
              />
            </div>
          )}
        </div>
        <hr />
        <Button
          variant='outlined'
          fullWidth
          onClick={() => setToggleWatering(!toggleWatering)}>
          Water Plants
        </Button>

        {toggleWatering && (
          <div
            style={{
              background: COLOUR_ACCENT,
              padding: '1rem',
              borderRadius: '0.5rem',
            }}>
            <WateringForm
              space={{
                id: space.id,
                name: space.name,
                room_type: space.room_type,
                light_direction: space.light_direction,
                thumb: space.picture?.thumb || '',
              }}
              plants={space.plants}
              onComplete={() => setToggleWatering(false)}
            />
          </div>
        )}

        {space.plants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
        {toggleAddPlant ? (
          <PlantForm
            addToSpace={space_id}
            debug
            altButton={{
              label: 'Cancel',
              onClick: () => setToggleAddPlant(false),
            }}
          />
        ) : (
          <Button onClick={() => setToggleAddPlant(true)}>Add Plant</Button>
        )}

        <hr />
        <pre>{JSON.stringify(space, null, 3)}</pre>
      </div>
    );
};

export default SpaceDetails;
