import {
  PlantAggProps,
  PlantConfig,
  PlantDetailProps,
  PlantProps,
} from '@mimir/PlantType';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useEffect, useState} from 'react';
import {plantRefs, spaceRefs, userRefs} from './firebaseUtil';

export const usePlantObserver = (
  currentUser: FirebaseAuthTypes.User | null,
) => {
  const [PlantDocs, setPlantDocs] = useState<PlantDetailProps[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    const {userAllPlantsRef} = userRefs(currentUser.uid);
    const unsubscribe = userAllPlantsRef.onSnapshot(
      plantsSnap => {
        if (plantsSnap.empty) return;
        const data: PlantDetailProps[] = [];
        plantsSnap.docs.forEach(plant => {
          const spaceDoc = {...(plant.data() as PlantProps), id: plant.id};
          const {plantCurrentConfigRef, plantLatestAggRef} = plantRefs(
            plant.id,
          );
          plantCurrentConfigRef.onSnapshot(
            configSnap => {
              const config = !configSnap.empty
                ? {
                    ...(configSnap.docs[0].data() as PlantConfig),
                    id: configSnap.docs[0].id,
                  }
                : undefined;
              plantLatestAggRef.onSnapshot(
                aggSnap => {
                  const aggs = !aggSnap.empty
                    ? {
                        ...(aggSnap.docs[0].data() as PlantAggProps),
                        id: aggSnap.docs[0].id,
                      }
                    : undefined;

                  const plantDetail: PlantDetailProps = {
                    ...spaceDoc,
                    config,
                    aggs,
                  };
                  data.push(plantDetail);
                },
                err => console.log(err),
              );
            },
            err => console.log(err),
          );
        });
        setPlantDocs(data);
      },
      err => console.log(err),
    );
    return () => unsubscribe();
  }, [currentUser?.uid]);

  return PlantDocs;
};
