import * as firestore from "@google-cloud/firestore";
import * as functions from "firebase-functions";
const client = new firestore.v1.FirestoreAdminClient();

export const adminDailyBackup = functions
  .region("europe-west1")
  .pubsub.schedule("every 7 days")
  .onRun((context) => {
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;

    if (!projectId) throw new Error("No ProjectId");
    const databaseName = client.databasePath(projectId, "(default)");

    // Replace BUCKET_NAME
    const bucket = `gs://hive-manager-backup/${projectId}/${new Date().toISOString()}`;

    return client
      .exportDocuments({
        name: databaseName,
        outputUriPrefix: bucket,
        // Leave collectionIds empty to export all collections
        // or set to a list of collection IDs to export,
        // collectionIds: ['users', 'posts']
        collectionIds: [],
      })
      .then((responses) => {
        const response = responses[0];
        console.log(`Operation Name: ${response["name"]}`);
        return;
      })
      .catch((err) => {
        console.error(err);
        throw new Error("Export operation failed");
      });
  });
