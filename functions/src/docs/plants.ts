import { PlantAggProps } from "@mimir/PlantType";

export const initPlantAggs = (
  timestamp: FirebaseFirestore.Timestamp
): PlantAggProps => {
  return {
    timestamp,
    children_total: 0,
    happiness_total: 0,
    health_total: 0,
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
