import React, { useMemo, useState } from 'react';
import { collectionData } from 'rxfire/firestore';
import app from '../../firebase';
import {
  SpaceAggProps,
  SpaceConfigProps,
  SpaceProps,
} from '../../types/SpaceType';
import { joinSpace } from '../helper/Operators/JoinSpace';
import useObservable from '../helper/useObservable';
import SpaceCard from '../Organism-Cards/SpaceCard';

interface Props {
  userId: string;
}

const db = app.firestore();

const Spaces: React.FC<Props> = ({ userId }) => {
  const [spaces, setSpaces] = useState<
    Array<
      SpaceProps & { id: string; config: SpaceConfigProps; agg: SpaceAggProps }
    >
  >([]);
  const data$ = useMemo(
    () =>
      collectionData(
        db.collection('mimirSpaces').where(`roles.${userId}`, '>=', ''),
        'id'
      ).pipe(joinSpace(db)),
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
    </div>
  );
};

export default Spaces;
