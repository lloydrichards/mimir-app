import firebase from "firebase";
import { collectionData, docData } from "rxfire/firestore";
import { combineLatest, defer, Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { SpaceConfigProps, SpaceProps } from "../../../types/SpaceType";

export const spaceDetails = (db: firebase.firestore.Firestore) => {
  return (source: any) =>
    defer(() => {
      let parent: SpaceProps & { id: string };

      return source.pipe(
        switchMap((data: SpaceProps & { id: string }) => {
          parent = data;

          const config$ = collectionData(
            db
              .doc(`mimirSpaces/${parent.id}`)
              .collection("Configs")
              .where("current", "==", true)
              .orderBy("timestamp", "desc")
              .limit(1),
            "id"
          );

          const aggs$ = collectionData(
            db
              .doc(`mimirSpaces/${parent.id}`)
              .collection("Aggs")
              .orderBy("timestamp", "desc")
              .limit(1),
            "id"
          );
          const daily$ = collectionData(
            db
              .doc(`mimirSpaces/${parent.id}`)
              .collection("Daily")
              .orderBy("timestamp", "desc")
              .limit(3),
            "id"
          );

          const plants$ = config$.pipe(
            switchMap((config: any) => {
              const current: SpaceConfigProps & { id: string } = config[0];

              const plants$: Array<Observable<unknown>> = [];
              current.plant_ids.forEach((id) =>
                plants$.push(
                  docData(db.collection("mimirPlants").doc(id || ""), "id")
                )
              );
              if (plants$.length === 0) return of(["REMOVE"]);
              return combineLatest([...plants$]);
            }),
            map((arr: Array<any>) => arr.filter((i) => i !== "REMOVE"))
          );

          return combineLatest([config$, aggs$, daily$, plants$]);
        }),
        map((arr: any) => {
          const config = arr[0][0];
          const aggs = arr[1][0];
          const daily = arr[2];
          const plants = arr[3];

          return { ...parent, config, aggs, daily, plants };
        })
      );
    });
};
