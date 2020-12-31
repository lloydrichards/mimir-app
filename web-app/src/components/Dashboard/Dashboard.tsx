import React, { useState } from 'react';
import { useAuth } from '../auth/Auth';
import Login from '../auth/Login';
import { collectionData } from 'rxfire/firestore';
import app from '../../firebase';
import useObservable from '../helper/useObservable';
import { UserProps } from '../../types/UserType';

const db = app.firestore();

function Dashboard() {
  const { currentUser } = useAuth();
  const [user, setUser] = useState<UserProps>({} as UserProps);

  if (currentUser) {
    db.collection('mimirUsers')
      .doc(currentUser.uid)
      .get()
      .then((i) => {
        console.log(i);
        setUser(i.data() as UserProps);
      });
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        {currentUser ? `${currentUser.email} (${currentUser.uid})` : <Login />}
      </p>
      <p>Date Created: {user?.date_created?.toDate()}</p>
    </div>
  );
}

export default Dashboard;
