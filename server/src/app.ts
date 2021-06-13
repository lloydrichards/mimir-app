import * as admin from "firebase-admin";
import firebase from "firebase/app";
import { Picture } from "../../types/GenericType";
import { PlantTypes } from "../../types/PlantType";
import("firebase/functions");

import {
  ExposureTypes,
  FormTypes,
  GrowthRateTypes,
  HabitatTypes,
  HardinessTypes,
  MaintenanceTypes,
  ModelProps,
  PestTypes,
  SoilTypes,
  SpeciesProps,
  WaterTypes,
} from "../../types/SpeciesType";

var serviceAccount = require("../serviceAccountKey.json");

var combinedData: Array<
  OldSpeciesProps & { model: ModelProps }
> = require("../combined.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = firebase.initializeApp({
  apiKey: "AIzaSyATtD1MmPJo9bdSRQuPghzPwI3ROcdSfE0",
  authDomain: "mimir-app-dev.firebaseapp.com",
  projectId: "mimir-app-dev",
  storageBucket: "mimir-app-dev.appspot.com",
  messagingSenderId: "999550951543",
  appId: "1:999550951543:web:2822c33ea1a8ec68d36672",
  measurementId: "G-CFQVCR1SEH",
});

export const db = admin.firestore();
export const timestamp = admin.firestore.Timestamp.now();
//const increment = admin.firestore.FieldValue.increment;

export type OldSpeciesProps = {
  id: string;
  images: Array<Picture>;
  family: string;
  genus: string;
  species: string;
  subspecies: string | null;
  cultivar: string | null;
  description: string;
  common_name: Array<string>;
  type: PlantTypes;
  habitat: Array<HabitatTypes>;
  form: Array<FormTypes>;
  origin: Array<string>;
  edible: boolean;
  poisonous: boolean;
  pet_friendly: boolean;
  air_purifying: boolean;
  hardiness: Array<HardinessTypes>;
  exposure: Array<ExposureTypes>;
  soil: Array<SoilTypes>;
  water: Array<WaterTypes>;
  height_max: number | null;
  height_min: number | null;
  spread_min: number | null;
  spread_max: number | null;
  growth_rate: GrowthRateTypes | null;
  maintenance: MaintenanceTypes | null;
  pests: Array<PestTypes>;
};

console.log("Starting mimir-app Server...");

Promise.all(
  combinedData.map((d) => {

    if(!d.species){
      console.log(d.id)
    }
    const batch = db.batch();
    const model: ModelProps = { ...d.model, current: true, timestamp };
    const {
      id,
      air_purifying,
      common_name,
      cultivar,
      description,
      edible,
      exposure,
      family,
      form,
      genus,
      growth_rate,
      hardiness,
      height_max,
      height_min,
      images,
      maintenance,
      origin,
      pests,
      pet_friendly,
      poisonous,
      soil,
      species,
      spread_max,
      spread_min,
      subspecies,
      type,
      water,
    } = d;
    const data: SpeciesProps = {
      id,
      common_name,
      description,
      botanical: {
        cultivar,
        family,
        species,
        genus,
        subspecies,
      },
      growth: {
        form,
        exposure,
        rate: growth_rate,
        hardiness,
        height_max,
        height_min,
        maintenance,
        spread_max,
        spread_min,
        water,
        soil,
      },
      traits: {
        air_purifying,
        edible,
        origin,
        pests,
        pet_friendly,
        poisonous,
      },
      habitat: [],
      images,
      type,
    };

    batch.set(db.collection("Species").doc(d.id), data);
    batch.set(
      db.collection("Species").doc(d.id).collection("model").doc(),
      model
    );
    return batch.commit();
  })
).then(() => console.log("completed"));
