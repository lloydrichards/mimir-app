import * as firestore from "@google-cloud/firestore";
import * as functions from "firebase-functions";
const client = new firestore.v1.FirestoreAdminClient();

export const adminRestoreFromBackup = functions
  .region("europe-west1")
  .https.onCall((data: { bucketPath: string }) => {
    const { bucketPath } = data;
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;

    if (!projectId) throw new Error("No ProjectId");

    // Replace BUCKET_NAME
    const bucket = `gs://hive-manager-backup/${bucketPath}`;

    return client
      .importDocuments({ inputUriPrefix: bucket, collectionIds: [] })
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
