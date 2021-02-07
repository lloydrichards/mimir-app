import { Button } from '@material-ui/core';
import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { collectionData } from 'rxfire/firestore';
import app from '../../firebase';
import {
  SpaceAggProps,
  SpaceConfigProps,
  SpaceProps,
} from '../../types/SpaceType';
import { spaceList } from '../helper/Operators/spaceList';
import useObservable from '../helper/useObservable';
import SpaceCard from '../Organism-Cards/SpaceCard';

interface Props {
  userId: string;
}

const db = app.firestore();

const Spaces: React.FC<Props> = ({ userId }) => {
  const history = useHistory();
  const [spaces, setSpaces] = useState<
    Array<
      SpaceProps & {
        id: string;
        config: SpaceConfigProps & { id: string };
        agg: SpaceAggProps & { id: string };
      }
    >
  >([]);
  const data$ = useMemo(
    () =>
      collectionData(
        db.collection('mimirSpaces').where(`roles.${userId}`, '>=', ''),
        'id'
      ).pipe(spaceList(db)),
    [userId]
  );

  useObservable(data$, setSpaces);

  console.log('Spaces: ', spaces);

  return (
    <div>
      <h3>Spaces</h3>
      {spaces.map((space) => (
        <div key={space.id}>
          <SpaceCard spaceDoc={space} config={space.config} />
        </div>
      ))}
      <Button
      fullWidth
        variant='contained'
        size='medium'
        onClick={() => history.push('/addSpace')}>
        Add Space
      </Button>
    </div>
  );
};

export default Spaces;
