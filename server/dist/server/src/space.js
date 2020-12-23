"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.space_CREATE = void 0;
const app_1 = require("./app");
const space_CREATE = (user_id, data) => {
    const batch = app_1.db.batch();
    const newSpace = app_1.db.collection('mimirSpaces').doc();
    const spaceLog = newSpace.collection('Logs').doc();
    const userLog = app_1.db
        .collection('mimirUsers')
        .doc(user_id)
        .collection('Logs')
        .doc();
    const initSpaceLog = {
        timestamp: app_1.timestamp,
        type: ['SPACE_CREATED', 'POINTS'],
        content: {
            device_id: newSpace.id,
            user_id: user_id,
            points: 10,
        },
    };
    const initSpaceDoc = Object.assign(Object.assign({}, data), { date_created: app_1.timestamp, date_modified: null, roles: { [user_id]: 'ADMIN' } });
    batch.set(newSpace, initSpaceDoc);
    batch.set(spaceLog, initSpaceLog);
    batch.set(userLog, initSpaceLog);
    return batch
        .commit()
        .then(() => console.log('Successfully added Space!'))
        .catch((error) => console.error(error));
};
exports.space_CREATE = space_CREATE;
//# sourceMappingURL=space.js.map