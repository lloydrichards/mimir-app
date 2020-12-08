import { SpaceConfigProps } from '../types/SpaceType';

export const initSpaceAgg = (timestamp: FirebaseFirestore.FieldValue) => {
  return {
    timestamp,
    read_total: 0,
    plant_total: 0,
    dead_total: 0,
    inspection_total: 0,
    inspection_last: null,
    watering_total: 0,
    watering_last: null,
    fertilizer_last: null,
    temperature: {
      min: 0,
      avg: 0,
      max: 0,
    },
    humidity: {
      min: 0,
      avg: 0,
      max: 0,
    },
    light: {
      shade: 0,
      half_shade: 0,
      full: 0,
      avg: 0,
      max: 0,
    },
    air: {
      avg: 0,
      max: 0,
    },
  };
};

export const initSpaceConfig = (
  timestamp: FirebaseFirestore.FieldValue
): SpaceConfigProps => {
  return {
    timestamp,
    current: true,
    devices: [],
    plant_ids: [],
    plants: [],
    diseases: [],
  };
};
