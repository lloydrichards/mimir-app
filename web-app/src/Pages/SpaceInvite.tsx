import React, { useEffect, useMemo, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { collectionData, docData } from 'rxfire/firestore';
import { useAuth } from '../components/auth/Auth';
import Login from '../components/auth/Login';
import useObservable from '../components/helper/useObservable';
import { db } from '../firebase';
import { SpaceProps } from '../types/SpaceType';

type Props = {} & Partial<RouteComponentProps<{ space_id: string }>>;

const SpaceInvite: React.FC<Props> = ({ match, location }) => {
  const { currentUser } = useAuth();
  const space_id = match?.params.space_id;
  const [fromId, setFromId] = useState<string | null>();
  const [token, setToken] = useState<string | null>('');
  const [space, setSpace] = useState<SpaceProps | null>();

  useEffect(() => {
    const params = new URLSearchParams(location?.search);
    setFromId(params.get('from'));
    setToken(params.get('token'));
  }, []);
  console.log(token);
  if (!currentUser) return <Login />;

  console.log(space);
  if (fromId === currentUser?.uid)
    return <Redirect to={`/space/${space_id}`} />;

  return (
    <div>
      {fromId} -- {token}
    </div>
  );
};

export default SpaceInvite;
