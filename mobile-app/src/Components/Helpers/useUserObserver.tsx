import {
  UserProps,
  UserSettingsProps,
  UserAggProps,
  UserDetailProps,
} from '@mimir/UserType';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useEffect, useState} from 'react';
import {userRefs} from './firestoreUtil';

export const useUserObserver = (currentUser: FirebaseAuthTypes.User | null) => {
  const [userDoc, setUserDoc] = useState<UserDetailProps | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    const {userDocRef, userSettingsRef, userLatestAggRef} = userRefs(
      currentUser.uid,
    );
    const unsubscribe = userDocRef.onSnapshot(
      userSnap => {
        if (!userSnap.exists) return;
        const userDoc = {...(userSnap.data() as UserProps), id: userSnap.id};

        if (
          currentUser.displayName &&
          currentUser.displayName !== userDoc.username
        ) {
          userDocRef.update({username: currentUser.displayName});
        }

        userSettingsRef.onSnapshot(
          settingSnap => {
            const settings = settingSnap.data() as UserSettingsProps;
            userLatestAggRef.onSnapshot(
              aggSnap => {
                const aggs = !aggSnap.empty
                  ? {
                      ...(aggSnap.docs[0].data() as UserAggProps),
                      id: aggSnap.docs[0].id,
                    }
                  : undefined;
                const userDetails: UserDetailProps = {
                  ...userDoc,
                  settings,
                  aggs,
                };
                setUserDoc(userDetails);
              },
              err => console.log(err),
            );
          },
          err => console.log(err),
        );
      },
      err => console.log(err),
    );
    return () => unsubscribe();
  }, [currentUser?.uid]);

  return userDoc;
};
