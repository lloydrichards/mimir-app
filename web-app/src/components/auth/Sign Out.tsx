import React from 'react';
import firebase from '../../firebase';

const SignOut = () => {
  return (
    <button
      onClick={async () =>
        await firebase
          .auth()
          .signOut()
          .then(() => console.log('Successfully Signed Out'))
      }>
      <a>Sign Out</a>
    </button>
  );
};

export default SignOut;
