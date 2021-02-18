import * as functions from 'firebase-functions';
import { db, timestamp } from '..';
import { Log } from '../types/LogType';
import { SpaceProps } from '../types/SpaceType';
import { UserProps } from '../types/UserType';

export const InviteSpace = functions.https.onCall(
  async (data: { from: string; space_id: string; token: string }, context) => {
    const { from, space_id, token } = data;

    if (!context.auth) throw new Error('No Authentication');
    const userId = context.auth.uid;
    const userRef = db.collection('mimirUsers').doc(userId);
    const fromUserRef = db.collection('mimirUsers').doc(from);

    const userLog = userRef.collection('Logs').doc();
    const fromLog = fromUserRef.collection('Logs').doc();

    const tokenQuery = db
      .collection('mimirSpaces')
      .where(`roles.${token}`, '>=', '');

    return db.runTransaction(async (t) => {
      const tokenSpace = await t.get(tokenQuery);
      if (tokenSpace.empty) throw new Error('No Invite Found');

      const tokenSpaceDoc = tokenSpace.docs.find((i) => i.id === space_id);
      if (!tokenSpaceDoc) throw new Error('Wrong Space Id');

      const fromUserDoc = (await t.get(fromUserRef)).data() as UserProps;
      const userDoc = (await t.get(userRef)).data() as UserProps;

      const spaceDoc = tokenSpaceDoc.data() as SpaceProps;
      const newLog: Log = {
        timestamp,
        type: ['USER_UPDATED', 'USER_INVITED'],
        content: {
          user: {
            id: userId,
            username: userDoc.username,
            gardener: userDoc.gardener,
          },
          fromUser: {
            id: from,
            username: fromUserDoc.username,
            gardener: fromUserDoc.gardener,
          },
          space: {
            id: tokenSpaceDoc.id,
            name: spaceDoc.name,
            light_direction: spaceDoc.light_direction,
            room_type: spaceDoc.room_type,
            thumb: spaceDoc.picture?.thumb || '',
          },
          points: 100,
        },
      };

      const roles = spaceDoc.roles;
      roles[userId] = roles[token];
      delete roles[token];

      t.update(tokenSpaceDoc.ref, { date_modified: timestamp, roles });
      tokenSpace.docs.forEach((i) => {
        const _roles = i.data().roles;
        delete _roles[token];

        return t.update(i.ref, { roles: _roles });
      });

      t.set(userLog, newLog);
      t.set(fromLog, newLog);
      t.set(tokenSpaceDoc.ref, newLog);
    });
  }
);
