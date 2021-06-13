"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestamp = exports.db = void 0;
const admin = __importStar(require("firebase-admin"));
const app_1 = __importDefault(require("firebase/app"));
Promise.resolve().then(() => __importStar(require("firebase/functions")));
var serviceAccount = require("../serviceAccountKey.json");
var combinedData = require("../combined.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const app = app_1.default.initializeApp({
    apiKey: "AIzaSyATtD1MmPJo9bdSRQuPghzPwI3ROcdSfE0",
    authDomain: "mimir-app-dev.firebaseapp.com",
    projectId: "mimir-app-dev",
    storageBucket: "mimir-app-dev.appspot.com",
    messagingSenderId: "999550951543",
    appId: "1:999550951543:web:2822c33ea1a8ec68d36672",
    measurementId: "G-CFQVCR1SEH",
});
exports.db = admin.firestore();
exports.timestamp = admin.firestore.Timestamp.now();
console.log("Starting mimir-app Server...");
Promise.all(combinedData.map((d) => {
    if (!d.species) {
        console.log(d.id);
    }
    const batch = exports.db.batch();
    const model = Object.assign(Object.assign({}, d.model), { current: true, timestamp: exports.timestamp });
    const { id, air_purifying, common_name, cultivar, description, edible, exposure, family, form, genus, growth_rate, hardiness, height_max, height_min, images, maintenance, origin, pests, pet_friendly, poisonous, soil, species, spread_max, spread_min, subspecies, type, water, } = d;
    const data = {
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
    batch.set(exports.db.collection("Species").doc(d.id), data);
    batch.set(exports.db.collection("Species").doc(d.id).collection("model").doc(), model);
    return batch.commit();
})).then(() => console.log("completed"));
//# sourceMappingURL=app.js.map