import { PlantAggProps } from "@mimir/PlantType";

export const initPlantAggs = (
  timestamp: FirebaseFirestore.Timestamp
): PlantAggProps => {
  return {
    timestamp,
    children_total: 0,
    happiness_total: 0,
    happiness_current: 0,
    health_total: 0,
    health_current: 0,
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
        shade: 0,
        half_shade: 0,
        full_sun: 0,
        avg: 0,
        max: 0,
      },
    },
  };
};
