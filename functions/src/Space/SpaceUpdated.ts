import { SpaceProps, SpaceType } from "@mimir/SpaceType";
import * as functions from "firebase-functions";
import {
  AdminCollection,
  SpacesStats,
  WateringsCollection,
} from "../firestore";
import { db, increment, timestamp } from "..";

const stats = db.collection(AdminCollection).doc(SpacesStats);

export const spaceUpdated = functions
  .region("europe-west1")
  .firestore.document("Spaces/{space_id}")
  .onUpdate(async (space, context) => {
    const spaceBefore = space.before.data() as SpaceProps;
    const spaceAfter = space.after.data() as SpaceProps;
    const space_id = context.params.space_id;
    if (spaceBefore === spaceAfter) return;

    const batchArr: FirebaseFirestore.WriteBatch[] = [];
    batchArr.push(db.batch());
    let opCounter = 0;
    let batchIndex = 0;

    const docSnapArr: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[] =
      [];

    const oldSpace: SpaceType = {
      id: space_id,
      name: spaceBefore.name,
      light_direction: spaceBefore.light_direction,
      room_type: spaceBefore.room_type,
      thumb: spaceBefore.picture?.thumb || "",
    };
    const updateSpace: SpaceType = {
      id: space_id,
      name: spaceAfter.name,
      light_direction: spaceAfter.light_direction,
      room_type: spaceAfter.room_type,
      thumb: spaceAfter.picture?.thumb || "",
    };

    if (oldSpace !== updateSpace) {
      await db
        .collection(WateringsCollection)
        .where("space.id", "==", space_id)
        .get()
        .then((snap) => snap.docs.forEach((doc) => docSnapArr.push(doc)));
    }

    docSnapArr.forEach((docSnap) => {
      batchArr[batchIndex].update(docSnap.ref, { space: updateSpace });
      opCounter++;

      if (opCounter === 499) {
        batchArr.push(db.batch());
        batchIndex++;
        opCounter = 0;
      }
    });

    const bothDirections = [
      ...new Set([
        ...spaceBefore.light_direction,
        ...spaceAfter.light_direction,
      ]),
    ];
    const light_direction: any = {};
    bothDirections.forEach((dir) => {
      if (
        spaceBefore.light_direction.includes(dir) &&
        !spaceAfter.light_direction.includes(dir)
      ) {
        light_direction[dir] = increment(-1);
      } else if (
        !spaceBefore.light_direction.includes(dir) &&
        spaceAfter.light_direction.includes(dir)
      ) {
        light_direction[dir] = increment(1);
      }
    });

    batchArr[batchIndex].set(
      stats,
      {
        last_added: timestamp,
        room_type: {
          [spaceBefore.room_type || "UNDEFINED"]: increment(
            spaceBefore.room_type === spaceAfter.room_type ? 0 : -1
          ),
          [spaceAfter.room_type || "UNDEFINED"]: increment(
            spaceBefore.room_type === spaceAfter.room_type ? 0 : 1
          ),
        },
        light_direction,
        region: {
          [spaceBefore.location.region || "UNDEFINED"]: increment(
            spaceBefore.location.region === spaceAfter.location.region ? 0 : -1
          ),
          [spaceAfter.location.region || "UNDEFINED"]: increment(
            spaceBefore.location.region === spaceAfter.location.region ? 0 : 1
          ),
        },
        country: {
          [spaceBefore.location.country || "UNDEFINED"]: increment(
            spaceBefore.location.country === spaceAfter.location.country
              ? 0
              : -1
          ),
          [spaceAfter.location.country || "UNDEFINED"]: increment(
            spaceBefore.location.country === spaceAfter.location.country ? 0 : 1
          ),
        },
        city: {
          [spaceBefore.location.city || "UNDEFINED"]: increment(
            spaceBefore.location.city === spaceAfter.location.city ? 0 : -1
          ),
          [spaceAfter.location.city || "UNDEFINED"]: increment(
            spaceBefore.location.city === spaceAfter.location.city ? 0 : 1
          ),
        },
      },
      { merge: true }
    );
  });
