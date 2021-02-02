import firebase from 'firebase';

import { combineLatest, defer } from 'rxjs';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { collectionData, docData } from 'rxfire/firestore';

export const joinSpace = (db: firebase.firestore.Firestore) => {
  return (source: any) =>
    defer(() => {
      let parent: any;

      return source.pipe(
        switchMap((data) => {
          parent = data;

          const config$ = parent.map((space: any) => {
            const aggs$ = collectionData(
              db
                .doc(`mimirSpaces/${space.id}`)
                .collection('Aggs')
                .orderBy('timestamp', 'desc')
                .limit(1)
            );

            return collectionData(
              db
                .doc(`mimirSpaces/${space.id}`)
                .collection('Configs')
                .where('current', '==', true)
                .orderBy('timestamp', 'desc')
                .limit(1)
            ).pipe(
              withLatestFrom(aggs$),
              map(([config, aggs]) => {
                return { config: config[0], aggs: aggs[0] };
              })
            );
          });

          return combineLatest([...config$]);
        }),
        map((arr: any) =>
          parent.map((space: any, idx: any) => {
            return { ...space, ...arr[idx] };
          })
        )
      );
    });
};
