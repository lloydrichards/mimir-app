import React, { useEffect } from 'react';
import { useAuth } from '../components/auth/Auth';
import Login from '../components/auth/Login';
import app from '../firebase';

import Spaces from '../components/Dashboard/Spaces';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { UserProps } from '../types/UserType';
import SpaceForm from '../components/Organism-Forms/SpaceForm';
import { COLOUR_SUBTLE } from '../Styles/Colours';

const db = app.firestore();

function Dashboard() {
  const { currentUser, userDoc, setUserDoc } = useAuth();
  const history = useHistory();

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

  console.log("User:", userDoc)
  return (
    <div>
      <h1>Dashboard</h1>
      <Button variant='outlined' onClick={() => history.push('/encyclopedia')}>
        Add Species
      </Button>
      {userDoc?.profile_picture ? (
          <img
            alt="Profile Picture"
            src={userDoc?.profile_picture.url}
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

      <p>Date Created: {userDoc?.date_created?.toDate().toDateString()}</p>
      <p>Garden Level: {userDoc?.gardener}</p>
      <p>Subscription: {userDoc?.subscription}</p>
      <Button variant='text' onClick={() => history.push('/profile')}>
        Update Profile
      </Button>

      <Spaces userId={currentUser.uid} />
    </div>
  );
}

export default Dashboard;
