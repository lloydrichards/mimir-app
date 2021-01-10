import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/Auth';
import Login from '../auth/Login';
import app from '../../firebase';
import { UserProps } from '../../types/UserType';
import { SpaceProps } from '../../types/SpaceType';

import { collectionData } from 'rxfire/firestore';
import useObservable from '../helper/useObservable';
import Spaces from './Spaces';
import SignUp from '../auth/SignUp';

const db = app.firestore();

function Dashboard() {
  const { currentUser } = useAuth();
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

  console.log(currentUser);

  if(!currentUser) return <Login />

  return (
    <div>
      <h1>Dashboard</h1>


      <p>Date Created: {user?.date_created?.toDate().toDateString()}</p>
      <p>Garden Level: {user?.gardener}</p>
      <p>Subscription: {user?.subscription}</p>

      <Spaces userId={currentUser.uid} / >

        <SignUp />
    </div>
  );
}

export default Dashboard;
