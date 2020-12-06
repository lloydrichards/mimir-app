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
const admin = __importStar(require("firebase-admin"));
var serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
const timestamp = admin.firestore.FieldValue.serverTimestamp();
//const increment = admin.firestore.FieldValue.increment;
console.log('Starting mimir-app Server...');
const space_CREATE = (user_id, data) => {
    const batch = db.batch();
    const newSpace = db.collection('mimirSpaces').doc();
    const newLog = newSpace.collection('Logs').doc();
    const initSpaceLog = {
        timestamp,
        type: ['SPACE_CREATED'],
        content: {
            device_id: newSpace.id,
            created_by: user_id,
        },
    };
    const initSpaceDoc = Object.assign(Object.assign({}, data), { date_created: timestamp, date_modified: null, roles: { [user_id]: 'ADMIN' } });
    batch.set(newSpace, initSpaceDoc);
    batch.set(newLog, initSpaceLog);
    return batch
        .commit()
        .then(() => console.log('Successfully added Space!'))
        .catch((error) => console.error(error));
};
space_CREATE('LXSJXgTDOIPiPgFDP3iVcfo0qdc2', {
    name: 'Test Space #1',
    description: 'A Space for testing things',
    room_type: 'OTHER',
    sun_exposure: 'HALF_SHADE',
    location: {
        region: 'Europe',
        country: 'Switzerland',
        city: 'Zurich',
        address: '',
    },
    profile_picture: {
        url: '',
        ref: '',
        thumb: '',
    },
    owner: {
        name: 'Tester',
        email: 'tester@word.com',
        id: 'LXSJXgTDOIPiPgFDP3iVcfo0qdc2',
    },
});
//# sourceMappingURL=app.js.map