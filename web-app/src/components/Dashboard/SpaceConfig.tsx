import React, { useMemo, useState } from 'react';
import { collectionData } from 'rxfire/firestore';
import { map } from 'rxjs/operators';
import app from '../../firebase';
import { SpaceConfigProps } from '../../types/SpaceType';
import useObservable from '../helper/useObservable';
interface Props {
  spaceId: string;
}

const db = app.firestore();

const SpaceConfig: React.FC<Props> = ({ spaceId }) => {
  const [config, setConfig] = useState<SpaceConfigProps>(
    {} as SpaceConfigProps
  );
  const config$ = useMemo(
    () =>
      collectionData(
        db
          .collection('mimirSpaces')
          .doc(spaceId)
          .collection('Configs')
          .where('current', '==', true)
          .limit(1),
        'id'
      ).pipe(map((i) => i[0])),
    [spaceId]
  );

  useObservable(config$, setConfig);
  console.log(config);

  if (!config.plants) return <div>No Plants</div>;
  return (
    <div>
      {config.plants.map((plant) => (
        <div key={plant?.id}>
          {plant?.nickname} ({plant?.botanical_name})
        </div>
      ))}
    </div>
  );
};

export default SpaceConfig;
