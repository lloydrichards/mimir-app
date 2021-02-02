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
require('firebase/functions');
var serviceAccount = require('../serviceAccountKey.json');
var combinedData = require('../combined.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const app = app_1.default.initializeApp({
    apiKey: 'AIzaSyATtD1MmPJo9bdSRQuPghzPwI3ROcdSfE0',
    authDomain: 'mimir-app-dev.firebaseapp.com',
    projectId: 'mimir-app-dev',
    storageBucket: 'mimir-app-dev.appspot.com',
    messagingSenderId: '999550951543',
    appId: '1:999550951543:web:2822c33ea1a8ec68d36672',
    measurementId: 'G-CFQVCR1SEH',
});
const test = app.functions().httpsCallable('readingTest');
exports.db = admin.firestore();
exports.timestamp = admin.firestore.Timestamp.now();
//const increment = admin.firestore.FieldValue.increment;
console.log('Starting mimir-app Server...');
combinedData.forEach((s) => {
    const batch = exports.db.batch();
    const { family, genus, species, subspecies, cultivar, description, common_name, type, habitat, form, origin, edible, poisonous, pet_friendly, air_purifying, hardiness, exposure, soil, water, height_max, height_min, spread_min, spread_max, growth_rate, maintenance, pests, model, } = s;
    const species_id = s.id;
    const speciesDoc = exports.db.collection('mimirSpecies').doc(species_id);
    const modelDoc = speciesDoc.collection('Model').doc('--Init--');
    if (!species)
        return console.log(species_id, 'Missing Species');
    const doc = {
        family,
        genus,
        species,
        subspecies,
        cultivar,
        description,
        common_name,
        images: [],
        type,
        habitat,
        form,
        origin,
        edible,
        poisonous,
        pet_friendly,
        air_purifying,
        hardiness,
        exposure,
        soil,
        water,
        height_max,
        height_min,
        spread_min,
        spread_max,
        growth_rate,
        maintenance,
        pests,
    };
    batch.set(speciesDoc, doc);
    batch.set(modelDoc, Object.assign(Object.assign({}, model), { timestamp: exports.timestamp, current: true }));
    return batch.commit().then(() => console.log(species_id, 'Added'));
});
// space_CREATE('LXSJXgTDOIPiPgFDP3iVcfo0qdc2', {
//   name: 'Test Space #2',
//   description: 'A Space for testing things',
//   room_type: 'BEDROOM',
//   sun_exposure: 'HALF_SHADE',
//   location: {
//     region: 'Europe',
//     country: 'Switzerland',
//     city: 'Zurich',
//     address: '',
//   },
//   profile_picture: null,
//   owner: {
//     name: 'Tester',
//     email: 'tester@word.com',
//     id: 'LXSJXgTDOIPiPgFDP3iVcfo0qdc2',
//   },
// });
// plant_CREATE('LXSJXgTDOIPiPgFDP3iVcfo0qdc2', 'jdzguo67OlB5lu3KXTpo', {
//   nickname: 'Pothos',
//   description: ' Tester Plant',
//   profile_picture: null,
//   form: 'OVAL',
//   pot: {
//     type: 'TERRACOTTA',
//     size: 17,
//     tray: true,
//     hanging: false,
//   },
//   owner: {
//     name: 'Tester',
//     email: '',
//     id: 'LXSJXgTDOIPiPgFDP3iVcfo0qdc2',
//   },
//   parent: null,
//   species: {
//     family: 'Araceae',
//     genus: 'Scindapsus',
//     species: 'pictus',
//     subspecies: '',
//     cultivar: '',
//     id: 'Scindapsus pictus',
//   },
// });
// plant_MOVED(
//   'LXSJXgTDOIPiPgFDP3iVcfo0qdc2',
//   'agHYKTtkN6CpS313rw8X',
//   'Ax7QWEsm2g33AV0UjFya',
//   'jdzguo67OlB5lu3KXTpo'
// );
//# sourceMappingURL=app.js.map