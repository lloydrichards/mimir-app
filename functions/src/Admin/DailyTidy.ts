import * as functions from "firebase-functions";
import { PlantsCollection, SpacesCollection } from "../firestore";
const firestore_tools = require("firebase-tools");

import { db } from "..";

export const adminDailyTidy = functions
  .region("europe-west1")
  .pubsub.schedule("every 24 hours")
  .onRun(async (context) => {
    let opCount = 0;
    const project = process.env.GCLOUD_PROJECT;
    const token = functions.config().ci_token;

    await Promise.all(
      (await db.collection("_events").get()).docs.map((doc) => doc.ref.delete())
    );

    const emptySpaces = await db
      .collection(SpacesCollection)
      .where("roles", "==", {})
      .get();
    const emptyPlants = await db
      .collection(PlantsCollection)
      .where("roles", "==", {})
      .get();

    return Promise.all(
      [...emptySpaces.docs, ...emptyPlants.docs].map((doc) => {
        opCount++;
        firestore_tools.firestore.delete(doc.ref.path, {
          project,
          token,
          recursive: true,
          yes: true,
        });
      })
    ).then(() => console.log(`${opCount} Docs Deleted`));
  });
