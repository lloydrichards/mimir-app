import { SpaceAggProps, SpaceConfigProps, SpaceType } from "@mimir/SpaceType";

export const initSpaceAgg = (
  timestamp: FirebaseFirestore.Timestamp
): SpaceAggProps => {
  return {
    timestamp,
    plant_total: 0,
    dead_total: 0,
    inspection_total: 0,
    watering_total: 0,
    fertilizer_total: 0,
    env: {
      reading_total: 0,
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
        hr: { low: 0, medium: 0, bright: 0, full: 0 },
        avg: 0,
        max: 0,
      },
    },
  };
};

export const initSpaceConfig = (
  space: SpaceType,
  timestamp: FirebaseFirestore.Timestamp
): SpaceConfigProps => {
  return {
    timestamp,
    current: true,
    space,
    device_ids: [],
    devices: [],
    plant_ids: [],
    plants: [],
    diseases: [],
  };
};
