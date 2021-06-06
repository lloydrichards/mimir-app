import {
  PlantAggProps,
  PlantConfig,
  PlantDetailProps,
  PlantProps,
  WateringProps,
} from '@mimir/PlantType';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useEffect, useState} from 'react';
import {plantRefs, spaceRefs, userRefs} from './firestoreUtil';

export const usePlantObserver = (
  currentUser: FirebaseAuthTypes.User | null,
) => {
  const [PlantDocs, setPlantDocs] = useState<PlantDetailProps[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    const {userAllPlantsRef} = userRefs(currentUser.uid);
    const subscriber = userAllPlantsRef.onSnapshot(
      plantsSnap => {
        if (plantsSnap.empty) return;
        console.log(
          'Plant Observer: ',
          plantsSnap
            .docChanges()
            .map(i => ({plant_id: i.doc.id, type: i.type})),
        );
        const data: PlantDetailProps[] = [];
        plantsSnap.docs.forEach(plant => {
          const plantDoc = {...(plant.data() as PlantProps), id: plant.id};
          let config: PlantDetailProps['config'] | undefined = undefined;
          let aggs: PlantDetailProps['aggs'] | undefined = undefined;
          let watering: PlantDetailProps['watering'] | undefined = undefined;

          const {
            plantCurrentConfigRef,
            plantLatestAggRef,
            plantLatestWaterRef,
          } = plantRefs(plant.id);

          setPlantDocs(data => {
            if (data.find(d => d.id === plant.id)) {
              const spaceIndex = data.findIndex(d => d.id === plant.id);
              const newData = data;
              newData[spaceIndex] = plantDoc;
              return newData;
            } else {
              return [...data, plantDoc];
            }
          });

          // Observable for current Plant Config
          plantCurrentConfigRef.onSnapshot(
            configSnap => {
              if (!configSnap.empty) {
                config = {
                  ...(configSnap.docs[0].data() as PlantConfig),
                  id: configSnap.docs[0].id,
                };

                setPlantDocs(data => {
                  if (data.find(d => d.id === plant.id)) {
                    const spaceIndex = data.findIndex(d => d.id === plant.id);
                    const newData = data;
                    newData[spaceIndex].config = config;
                    return newData;
                  } else return data;
                });
              }
            },
            err => console.log(err),
          );
          plantLatestAggRef.onSnapshot(
            aggSnap => {
              if (!aggSnap.empty) {
                aggs = {
                  ...(aggSnap.docs[0].data() as PlantAggProps),
                  id: aggSnap.docs[0].id,
                };

                setPlantDocs(data => {
                  if (data.find(d => d.id === plant.id)) {
                    const spaceIndex = data.findIndex(d => d.id === plant.id);
                    const newData = data;
                    newData[spaceIndex].aggs = aggs;
                    return newData;
                  } else return data;
                });
              }
            },
            err => console.log(err),
          );
          plantLatestWaterRef.onSnapshot(
            waterSnap => {
              if (!waterSnap.empty) {
                watering = {
                  ...(waterSnap.docs[0].data() as WateringProps),
                  id: waterSnap.docs[0].id,
                };

                setPlantDocs(data => {
                  if (data.find(d => d.id === plant.id)) {
                    const spaceIndex = data.findIndex(d => d.id === plant.id);
                    const newData = data;
                    newData[spaceIndex].watering = watering;
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

  return PlantDocs;
};
