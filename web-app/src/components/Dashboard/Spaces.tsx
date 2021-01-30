import React, { useMemo, useState } from 'react';
import { collectionData } from 'rxfire/firestore';
import app from '../../firebase';
import { SpaceProps } from '../../types/SpaceType';
import useObservable from '../helper/useObservable';
import SpaceCard from '../Organism-Cards/SpaceCard';
import SpaceConfig from './SpaceConfig';
import SpaceReading from './SpaceReading';

interface Props {
  userId: string;
}

const db = app.firestore();

const Spaces: React.FC<Props> = ({ userId }) => {
  const [spaces, setSpaces] = useState<Array<SpaceProps & { id: string }>>([]);
  const data$ = useMemo(
    () =>
      collectionData(
        db.collection('mimirSpaces').where(`roles.${userId}`, '>=', ''),
        'id'
      ),
    [userId]
  );

  useObservable(data$, setSpaces);

  console.log('Spaces: ', spaces);

  return (
    <div>
      <h3>Spaces</h3>
      {spaces.map((space) => (
        <div key={space.id}>
          <SpaceCard spaceDoc={space} />
        </div>
      ))}
    </div>
  );
};

export default Spaces;
