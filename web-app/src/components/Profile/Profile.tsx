import React, { useState } from 'react';
import app from '../../firebase';
import { UserProps } from '../../types/UserType';
import { useAuth } from '../auth/Auth';
import Login from '../auth/Login';
import UpdateProfile from './UpdateProfile';

const db = app.firestore();

function Profile() {
  const { currentUser } = useAuth();
  const [userDoc, setUser] = useState<UserProps>();
  const [update, setUpdate] = useState<boolean>(false);
  if (!currentUser) return <Login />;

  db.collection('mimirUsers')
    .doc(currentUser.uid)
    .onSnapshot((i) => setUser(i.data() as UserProps));

  if (!userDoc) return <div>Loading</div>;

  return (
    <div>
      <h2>Profile</h2>
      <UpdateProfile
        userId={currentUser.uid}
        userDoc={userDoc}
      />
    </div>
  );
}

export default Profile;
