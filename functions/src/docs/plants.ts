import { PlantAggProps } from '../../../types/PlantType';

export const initPlantAggs = (timestamp: FirebaseFirestore.Timestamp): PlantAggProps => {
  return {
    timestamp,
    space: null,
    children_total: 0,
    happiness_total: 0,
    happiness_current: 0,
    health_total: 0,
    health_current: 0,
    reading_total: 0,
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
      full_sun: 0,
      avg: 0,
      max: 0,
    },
    air: {
      avg: 0,
      max: 0,
    },
  };
};
