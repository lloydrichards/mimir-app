import { Button } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { COLOUR_SUBTLE } from '../../Styles/Colours';
import { UserProps } from '../../types/UserType';

interface Props {
  userDoc: UserProps;
}

const ProfileCard: React.FC<Props> = ({ userDoc }) => {
  const history = useHistory();
  return (
    <div>
      {userDoc?.profile_picture.url ? (
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
      <Button variant='text' onClick={() => history.push('/profile')}>
        Update Profile
      </Button>
    </div>
  );
};

export default ProfileCard;
