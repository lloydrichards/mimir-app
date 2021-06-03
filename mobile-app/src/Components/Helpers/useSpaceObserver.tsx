import {
  SpaceAggProps,
  SpaceConfigProps,
  SpaceDetailProps,
  SpaceProps,
} from '@mimir/SpaceType';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useEffect, useState} from 'react';
import {spaceRefs, userRefs} from './firebaseUtil';

export const useSpaceObserver = (
  currentUser: FirebaseAuthTypes.User | null,
) => {
  const [SpaceDocs, setSpaceDocs] = useState<SpaceDetailProps[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    const {userAllSpacesRef} = userRefs(currentUser.uid);
    const unsubscribe = userAllSpacesRef.onSnapshot(
      spacesSnap => {
        if (spacesSnap.empty) return;
        const data: SpaceDetailProps[] = [];
        spacesSnap.docs.forEach(space => {
          const spaceDoc = {...(space.data() as SpaceProps), id: space.id};
          const {spaceLatestAggRef, spaceCurrentConfigRef} = spaceRefs(space.id);
          spaceCurrentConfigRef.onSnapshot(
            configSnap => {
              const config = !configSnap.empty ?{
                ...(configSnap.docs[0].data() as SpaceConfigProps),
                id: configSnap.docs[0].id,
              } : undefined;
              spaceLatestAggRef.onSnapshot(
                aggSnap => {
                  const aggs = !aggSnap.empty
                    ? {
                        ...(aggSnap.docs[0].data() as SpaceAggProps),
                        id: aggSnap.docs[0].id,
                      }
                    : undefined;

                  const spaceDetail: SpaceDetailProps = {
                    ...spaceDoc,
                    config,
                    aggs,
                  };
                  data.push(spaceDetail);
                },
                err => console.log(err),
              );
            },
            err => console.log(err),
          );
        });
        setSpaceDocs(data);
      },
      err => console.log(err),
    );
    return () => unsubscribe();
  }, [currentUser?.uid]);

  return SpaceDocs;
};
