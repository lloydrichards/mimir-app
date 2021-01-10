import React, { useMemo, useState } from 'react';
import { collectionData } from 'rxfire/firestore';
import { merge } from 'rxjs';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import app from '../../firebase';
import { SpaceProps } from '../../types/SpaceType';
import useObservable from '../helper/useObservable';
import SpaceConfig from './SpaceConfig';

interface Props {
  userId: string;
}

const db = app.firestore();

const Spaces: React.FC<Props> = ({ userId }) => {
  const [spaces, setSpaces] = useState<Array<SpaceProps & { id: string }>>([]);
  const SpaceDocs = useMemo(
    () => db.collection('mimirSpaces').where(`roles.${userId}`, '>=', ''),
    [userId]
  );
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
          <h3>
            {space.name} ({space.room_type})
          </h3>
          <SpaceConfig spaceId={space.id} />
        </div>
      ))}
    </div>
  );
};

export default Spaces;
