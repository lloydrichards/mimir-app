export const initDeviceDoc = (timestamp: FirebaseFirestore.FieldValue) => {
  return {
    nickname: '',
    date_created: timestamp,
    date_modified: null,
    description: '',
    version: {
      hardware: '',
      software: '',
    },
    owner: {
      name: '',
      email: '',
      id: '',
    },
    role: {},
  };
};

export const initDeviceAgg = (timestamp: FirebaseFirestore.FieldValue) => {
  return {
    timestamp,
    space: {
      name: '',
      room_type: '',
      id: '',
    },
    read_total: 0,
    battery_percent: 0,
    charge: false,
  };
};
