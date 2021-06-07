import { SpaceProps, SpaceType } from "@mimir/SpaceType";
import * as functions from "firebase-functions";
import { spaceRefs } from "src/util/firestoreUtil";
import { initSpaceConfig } from "../docs/space";
import {
  AdminCollection,
  SpaceConfigCollection,
  SpacesCollection,
  SpacesStats,
} from "../firestore";
import { db, increment, timestamp } from "../index";
import { once, setEventSuccess } from "../util/once";

const stats = db.collection(AdminCollection).doc(SpacesStats);

export const spaceCreated = functions
  .region("europe-west1")
  .firestore.document(`${SpacesCollection}/{space_id}`)
  .onCreate(
    once(async (space, context) => {
      const spaceRef = space.ref;
      const newConfig = spaceRef
        .collection(SpaceConfigCollection)
        .doc("--init--");
      return db
        .runTransaction(async (t) => {
          const spaceDoc = (await space.data()) as SpaceProps;

          const spaceType: SpaceType = {
            id: space.id,
            name: spaceDoc.name,
            room_type: spaceDoc.room_type,
            light_direction: spaceDoc.light_direction,
            thumb: spaceDoc.picture?.thumb || "",
          };
          
          t.set(newConfig, initSpaceConfig(spaceType, timestamp));

          const light_direction = {};
          spaceDoc.light_direction.forEach((dir) => {
            light_direction[dir] = increment(1);
          });
          setEventSuccess(t, context).set(
            stats,
            {
              spaces_total: increment(1),
              room_type: {
                [space.data().room_type || "UNDEFINED"]: increment(1),
              },
              light_direction,
              region: {
                [space.data().location.region || "UNDEFINED"]: increment(1),
              },
              country: {
                [space.data().location.country || "UNDEFINED"]: increment(1),
              },
              city: {
                [space.data().location.city || "UNDEFINED"]: increment(1),
              },
              last_added: timestamp,
            },
            { merge: true }
          );
        })
        .catch((error) => console.error(error));
    })
  );
