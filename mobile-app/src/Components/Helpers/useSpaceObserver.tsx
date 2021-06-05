import {
  SpaceAggProps,
  SpaceConfigProps,
  SpaceDetailProps,
  SpaceProps,
} from '@mimir/SpaceType';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useEffect, useState} from 'react';
import {spaceRefs, userRefs} from './firestoreUtil';

export const useSpaceObserver = (
  currentUser: FirebaseAuthTypes.User | null,
) => {
  const [SpaceDocs, setSpaceDocs] = useState<SpaceDetailProps[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    const {userAllSpacesRef} = userRefs(currentUser.uid);
    const subscriber = userAllSpacesRef.onSnapshot(
      spacesSnap => {
        if (spacesSnap.empty) return;
        console.log(
          'SpaceObserver: ',
          spacesSnap
            .docChanges()
            .map(i => ({space_id: i.doc.id, type: i.type})),
        );
        spacesSnap.docs.forEach(space => {
          const spaceDoc = {...(space.data() as SpaceProps), id: space.id};
          let config: SpaceDetailProps['config'] | undefined = undefined;
          let aggs: SpaceDetailProps['aggs'] | undefined = undefined;

          const {spaceLatestAggRef, spaceCurrentConfigRef} = spaceRefs(
            space.id,
          );

          setSpaceDocs(data => {
            if (data.find(d => d.id === space.id)) {
              const spaceIndex = data.findIndex(d => d.id === space.id);
              const newData = data;
              newData[spaceIndex] = spaceDoc;
              return newData;
            } else {
              return [...data, spaceDoc];
            }
          });
          spaceCurrentConfigRef.onSnapshot(
            configSnap => {
              if (!configSnap.empty) {
                config = {
                  ...(configSnap.docs[0].data() as SpaceConfigProps),
                  id: configSnap.docs[0].id,
                };

                setSpaceDocs(data => {
                  if (data.find(d => d.id === space.id)) {
                    const spaceIndex = data.findIndex(d => d.id === space.id);
                    const newData = data;
                    newData[spaceIndex].config = config;
                    return newData;
                  } else return data;
                });
              }
            },
            err => console.log(err),
          );
          spaceLatestAggRef.onSnapshot(
            aggSnap => {
              if (!aggSnap.empty) {
                aggs = {
                  ...(aggSnap.docs[0].data() as SpaceAggProps),
                  id: aggSnap.docs[0].id,
                };

                setSpaceDocs(data => {
                  if (data.find(d => d.id === space.id)) {
                    const spaceIndex = data.findIndex(d => d.id === space.id);
                    const newData = data;
                    newData[spaceIndex].aggs = aggs;
                    return newData;
                  } else return data;
                });
              }
            },
            err => console.log(err),
          );
        });
      },
      err => console.log(err),
    );
    return () => subscriber();
  }, [currentUser?.uid]);

  return SpaceDocs;
};
