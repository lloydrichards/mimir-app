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
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestamp = exports.db = void 0;
const admin = __importStar(require("firebase-admin"));
const plant_1 = require("./plant");
var serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
exports.db = admin.firestore();
exports.timestamp = admin.firestore.FieldValue.serverTimestamp();
//const increment = admin.firestore.FieldValue.increment;
console.log('Starting mimir-app Server...');
// space_CREATE('LXSJXgTDOIPiPgFDP3iVcfo0qdc2', {
//   name: 'Test Space #9',
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
plant_1.plant_CREATE('LXSJXgTDOIPiPgFDP3iVcfo0qdc2', 'zXfNRslZf9t6S8aLxJAg', {
    nickname: 'Plant #2',
    description: ' Tester Plant',
    profile_picture: null,
    form: 'OVAL',
    pot: {
        type: 'TERRACOTTA',
        size: 17,
        tray: true,
        hanging: false,
    },
    owner: {
        name: 'Tester',
        email: '',
        id: 'LXSJXgTDOIPiPgFDP3iVcfo0qdc2',
    },
    parent: null,
    species: {
        family: 'Fam',
        genus: 'Gen',
        species: 'spp',
        subspecies: '',
        cultivar: '',
        id: 'Tester Species #2',
    },
});
//# sourceMappingURL=app.js.map