import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/Auth';
import Login from '../auth/Login';
import app from '../../firebase';
import { UserProps } from '../../types/UserType';

import Spaces from './Spaces';
import SignUp from '../auth/SignUp';
import { Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

const db = app.firestore();

function Dashboard() {
  const { currentUser } = useAuth();
  const history = useHistory();
  const [user, setUser] = useState<UserProps>({} as UserProps);
  useEffect(() => {
    if (currentUser) {
      db.collection('mimirUsers')
        .doc(currentUser.uid)
        .get()
        .then((i) => {
          console.log(i.data());
          setUser(i.data() as UserProps);
        })
        .catch((err) => alert(err));
    } else {
      setUser({} as UserProps);
    }
  }, [currentUser]);

  if (!currentUser) return <Login />;

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Date Created: {user?.date_created?.toDate().toDateString()}</p>
      <p>Garden Level: {user?.gardener}</p>
      <p>Subscription: {user?.subscription}</p>
      <Button variant='text' onClick={() => history.push('/profile')}>
        Update Profile
      </Button>

      <Spaces userId={currentUser.uid} />
      
    </div>
  );
}

export default Dashboard;
