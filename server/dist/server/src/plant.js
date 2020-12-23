"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plant_MOVED = exports.plant_CREATE = void 0;
const app_1 = require("./app");
const plant_CREATE = (user_id, space_id, plantInput) => {
    const space = app_1.db.collection('mimirSpaces').doc(space_id);
    const spaceConfigs = space
        .collection('Configs')
        .where('current', '==', true)
        .orderBy('timestamp', 'desc');
    const newConfig = space.collection('Configs').doc();
    const newPlant = app_1.db.collection('mimirPlants').doc();
    const userLog = app_1.db
        .collection('mimirUsers')
        .doc(user_id)
        .collection('Logs')
        .doc();
    const spaceLog = space.collection('Logs').doc();
    const plantLog = newPlant.collection('Logs').doc();
    const newPlantDoc = Object.assign(Object.assign({}, plantInput), { alive: true, date_created: app_1.timestamp, date_modified: null, roles: {
            [user_id]: 'ADMIN',
        } });
    const newLog = {
        timestamp: app_1.timestamp,
        type: ['PLANT_CREATED', 'POINTS'],
        content: {
            user_id,
            space_id,
            plant_id: newPlant.id,
            points: 5,
        },
    };
    return app_1.db
        .runTransaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const configs = yield t.get(spaceConfigs);
        const currentConfig = configs.docs[0].data();
        t.set(newConfig, Object.assign(Object.assign({}, currentConfig), { timestamp: app_1.timestamp, current: true, plant_ids: currentConfig.plant_ids.concat(newPlant.id), plants: [
                ...currentConfig.plants,
                {
                    nickname: plantInput.nickname,
                    id: newPlant.id,
                    botanical_name: plantInput.species.id,
                    size: plantInput.pot.size,
                },
            ] }));
        t.set(newPlant, newPlantDoc);
        t.set(userLog, newLog);
        t.set(spaceLog, newLog);
        t.set(plantLog, newLog);
        configs.docs.map((i) => t.update(i.ref, { current: false }));
    }))
        .catch((error) => console.error(error));
};
exports.plant_CREATE = plant_CREATE;
const plant_MOVED = (user_id, plant_id, fromSpace_id, toSpace_id) => {
    const plant = app_1.db.collection('mimirPlants').doc(plant_id);
    const fromSpace = app_1.db.collection('mimirSpaces').doc(fromSpace_id);
    const toSpace = app_1.db.collection('mimirSpaces').doc(toSpace_id);
    const fromConfig = fromSpace
        .collection('Configs')
        .where('plant_ids', 'array-contains', plant_id)
        .where('current', '==', true)
        .orderBy('timestamp', 'desc');
    const toConfig = toSpace
        .collection('Configs')
        .where('current', '==', true)
        .orderBy('timestamp', 'desc');
    const newToConfig = toSpace.collection('Configs').doc();
    const newFromConfig = fromSpace.collection('Configs').doc();
    const fromLog = fromSpace.collection('Logs').doc();
    const toLog = fromSpace.collection('Logs').doc();
    const userLog = app_1.db
        .collection('mimirUsers')
        .doc(user_id)
        .collection('Logs')
        .doc();
    const plantLog = app_1.db
        .collection('mimirPlants')
        .doc(plant_id)
        .collection('Logs')
        .doc();
    const newLog = {
        timestamp: app_1.timestamp,
        type: ['PLANT_MOVED', 'POINTS'],
        content: {
            user_id,
            fromSpace_id: fromSpace_id,
            toSpace_id: toSpace_id,
            plant_id,
            points: 5,
        },
    };
    return app_1.db
        .runTransaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const fromConfigDoc = yield t.get(fromConfig);
        if (fromConfigDoc.docs.length === 0)
            throw 'No Plant found at Space';
        const toConfigDoc = yield t.get(toConfig);
        const plantDoc = (yield t.get(plant)).data();
        const currentToConfig = toConfigDoc.docs[0].data();
        const currentFromConfig = fromConfigDoc.docs[0].data();
        t.set(newToConfig, Object.assign(Object.assign({}, currentToConfig), { timestamp: app_1.timestamp, current: true, plant_ids: currentToConfig.plant_ids.concat(plant_id), plants: [
                ...currentToConfig.plants,
                {
                    nickname: plantDoc.nickname,
                    id: plant_id,
                    botanical_name: plantDoc.species.id,
                    size: plantDoc.pot.size,
                },
            ] }));
        t.set(newFromConfig, Object.assign(Object.assign({}, currentFromConfig), { timestamp: app_1.timestamp, current: true, plant_ids: currentFromConfig.plant_ids.filter((i) => i !== plant_id), plants: currentFromConfig.plants.filter((i) => (i === null || i === void 0 ? void 0 : i.id) !== plant_id) }));
        t.set(userLog, newLog);
        t.set(toLog, newLog);
        t.set(fromLog, newLog);
        t.set(plantLog, newLog);
        fromConfigDoc.docs.map((i) => t.update(i.ref, { current: false }));
        toConfigDoc.docs.map((i) => t.update(i.ref, { current: false }));
    }))
        .catch((error) => console.log(error));
};
exports.plant_MOVED = plant_MOVED;
//# sourceMappingURL=plant.js.map