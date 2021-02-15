import firebase from 'firebase';
import { combineLatest, defer } from 'rxjs';
import { map, switchMap, withLatestFrom, tap } from 'rxjs/operators';
import { collectionData } from 'rxfire/firestore';

export const spaceList = (db: firebase.firestore.Firestore) => {
  return (source: any) =>
    defer(() => {
      let parent: any;

      return source.pipe(
        switchMap((data) => {
          parent = data;

          const spaces$ = parent.map((space: any) => {
            const aggs$ = collectionData(
              db
                .doc(`mimirSpaces/${space.id}`)
                .collection('Aggs')
                .orderBy('timestamp', 'desc')
                .limit(1),
              'id'
            );

            const config$ = collectionData(
              db
                .doc(`mimirSpaces/${space.id}`)
                .collection('Configs')
                .where('current', '==', true)
                .orderBy('timestamp', 'desc')
                .limit(1),
              'id'
            );
            const readings$ = collectionData(
              db
                .collection('mimirReadings')
                .where('space_ids', 'array-contains', space.id)
                .orderBy('timestamp', 'desc')
                .limit(2),
              'id'
            );

            return combineLatest([aggs$, config$, readings$]);
          });

          return combineLatest([...spaces$]);
        }),
        tap((i) => console.log('tap', i)),
        map((arr: Array<Array<any>>) =>
          parent.map((space: any, idx: any) => {
            const config = arr[idx][1][0];
            const aggs = arr[idx][0][0];
            const readings = arr[idx][2];
            return { ...space, config, aggs, readings };
          })
        ),
        tap((i) => console.log('finished', i))
      );
    });
};
