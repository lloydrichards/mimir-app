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
const testScore = app.functions().httpsCallable('scoreCalculatorTest');
const plants_MOVE = app.functions().httpsCallable('movePlants');
exports.db = admin.firestore();
exports.timestamp = admin.firestore.Timestamp.now();
//const increment = admin.firestore.FieldValue.increment;
console.log('Starting mimir-app Server...');
// testScore({ plant_id: 'QoDIiogM6MFuACdbLJrQ' });
const data = {
    user: {
        gardener: 'BEGINNER',
        id: 'BOnlHozQMadp2zgn3WiF3iDQL8T2',
        username: 'tester',
    },
    plant: {
        botanical_name: 'Vanilla planifolia',
        id: '10Awh8CnY3rDxoxLW2SM',
        nickname: 'Vanilla Orchid',
        size: 20,
        type: 'SEMI_EVERGREEN',
    },
    toSpace: {
        id: '969KEoPkzc6nbNZm39SZ',
        name: 'Bedroom Desk',
        light_direction: ['NW', 'W', 'SW'],
        room_type: 'BEDROOM',
        thumb: '',
    },
};
plants_MOVE(data);
//# sourceMappingURL=app.js.map