import React, { useEffect, useMemo, useState } from 'react';
import { Redirect, RouteComponentProps, useHistory } from 'react-router-dom';
import { collectionData, docData } from 'rxfire/firestore';
import { useAuth } from '../components/auth/Auth';
import Login from '../components/auth/Login';
import useObservable from '../components/helper/useObservable';
import { db } from '../firebase';
import { SpaceProps } from '../types/SpaceType';

type Props = {} & Partial<RouteComponentProps<{ space_id: string }>>;

const SpaceInvite: React.FC<Props> = ({ match, location }) => {
  const history = useHistory();
  const { currentUser, inviteToSpace } = useAuth();
  const space_id = match?.params.space_id;
  const [fromId, setFromId] = useState<string>();

  useEffect(() => {
    const params = new URLSearchParams(location?.search);
    const token = params.get('token');
    const from = params.get('from');

    if (from === currentUser?.uid) return history.push(`/space/${space_id}`);
    if (!token || !from || !space_id) return;
    console.log('from', from);
    console.log('token', token);
    inviteToSpace(from, space_id, token)
      .then((i) => console.log(i))
      .catch((e) => console.log(e));
  }, []);

  if (!currentUser) return <Login />;

  return <div></div>;
};

export default SpaceInvite;
