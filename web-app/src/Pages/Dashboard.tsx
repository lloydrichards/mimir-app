import { Button } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { collectionData } from 'rxfire/firestore';
import { useAuth } from '../components/auth/Auth';
import Login from '../components/auth/Login';
import { spaceList } from '../components/helper/Operators/spaceList';
import useObservable from '../components/helper/useObservable';
import SpaceCard from '../components/Organism-Cards/SpaceCard';
import DeviceForm from '../components/Organism-Forms/DeviceForm';
import app from '../firebase';
import {
  SpaceListItemProps, SpaceType
} from '../types/SpaceType';
import { UserProps } from '../types/UserType';


const db = app.firestore();

function Dashboard() {
  const { currentUser, userDoc, setUserDoc } = useAuth();
  const history = useHistory();
  const [toggleDeviceForm, setToggleDeviceForm] = useState<boolean>(false);
  const [spaces, setSpaces] = useState<Array<SpaceListItemProps>>([]);
  const data$ = useMemo(
    () =>
      collectionData(
        db
          .collection('mimirSpaces')
          .where(`roles.${currentUser?.uid || ''}`, '>=', ''),
        'id'
      ).pipe(spaceList(db)),
    [currentUser]
  );

  useObservable(data$, setSpaces);

  console.log('Spaces: ', spaces);

  useEffect(() => {
    if (currentUser) {
      db.collection('mimirUsers')
        .doc(currentUser.uid)
        .get()
        .then((i) => {
          setUserDoc(i.data() as UserProps);
        })
        .catch((err) => alert(err));
    } else {
      setUserDoc({} as UserProps);
    }
  }, [currentUser, setUserDoc]);

  if (!currentUser) return <Login />;

  console.log('User:', userDoc);
  return (
    <div>
      <h1>Dashboard</h1>

      <div>
        {toggleDeviceForm ? (
          <DeviceForm
            spaces={spaces.map((s) => {
              const spaceTy: SpaceType = {
                id: s.id,
                light_direction: s.light_direction,
                room_type: s.room_type,
                name: s.name,
                thumb: s.picture?.thumb || '',
              };
              return spaceTy;
            })}
            altButton={{
              label: 'Cancel',
              onClick: () => setToggleDeviceForm(false),
            }}
          />
        ) : (
          <Button variant='outlined' onClick={() => setToggleDeviceForm(true)}>
            Register Device
          </Button>
        )}
      </div>

      <div>
        <h3>Spaces</h3>
        {spaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
        <Button
          fullWidth
          variant='contained'
          size='medium'
          onClick={() => history.push('/addSpace')}>
          Add Space
        </Button>
      </div>
    </div>
  );
}

export default Dashboard;
