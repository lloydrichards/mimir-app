import React, { useMemo, useState } from 'react';
import { collectionData } from 'rxfire/firestore';
import { map } from 'rxjs/operators';
import app from '../../firebase';
import { ReadingProps } from '../../types/ReadingType';
import useObservable from '../helper/useObservable';

interface Props {
  spaceId: string;
}

const db = app.firestore();
const SpaceReading: React.FC<Props> = ({ spaceId }) => {
  const [cur, setCur] = useState<ReadingProps>();

  const reading$ = useMemo(
    () =>
      collectionData(
        db
          .collection('mimirReadings')
          .where('space_ids', 'array-contains', spaceId)
          .orderBy('timestamp', 'desc')
          .limit(1),
        'id'
      ).pipe(map((i) => i[0])),
    [spaceId]
  );
  useObservable(reading$, setCur);

  return <div>
      {cur?.batteryPercent}
  </div>;
};

export default SpaceReading;
