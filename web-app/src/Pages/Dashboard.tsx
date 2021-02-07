import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/auth/Auth';
import Login from '../components/auth/Login';
import app from '../firebase';

import Spaces from '../components/Dashboard/Spaces';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { UserProps } from '../types/UserType';
import { COLOUR_SUBTLE } from '../Styles/Colours';
import DeviceForm from '../components/Organism-Forms/DeviceForm';

const db = app.firestore();

function Dashboard() {
  const { currentUser, userDoc, setUserDoc } = useAuth();
  const history = useHistory();
  const [toggleDeviceForm, setToggleDeviceForm] = useState<boolean>(false);

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
      {userDoc?.profile_picture ? (
        <img
          alt={`Profile of ${userDoc.username}`}
          src={userDoc?.profile_picture.url}
          height='180'
          width='180'
          style={{ borderRadius: '20rem' }}></img>
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

      <p>Date Created: {userDoc?.date_created?.toDate().toDateString()}</p>
      <p>Garden Level: {userDoc?.gardener}</p>
      <p>Subscription: {userDoc?.subscription}</p>
      <Button variant='text' onClick={() => history.push('/profile')}>
        Update Profile
      </Button>
      <div>
        {toggleDeviceForm ? (
          <DeviceForm
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

      <Spaces userId={currentUser.uid} />
    </div>
  );
}

export default Dashboard;
