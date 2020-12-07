export const initPlantAggs = (timestamp: FirebaseFirestore.FieldValue) => {
  return {
    timestamp,
    space: {},
    children_total: 0,
    happiness_total: 0,
    happiness_current: 0,
    health_total: 0,
    health_current: 0,
    read_total: 0,
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
