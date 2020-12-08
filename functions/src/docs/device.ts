import { DeviceAggProps, DeviceProps } from '../types/DeviceType';

export const initDeviceDoc = (timestamp: FirebaseFirestore.FieldValue): DeviceProps => {
  return {
    nickname: '',
    date_created: timestamp,
    date_modified: null,
    description: '',
    profile_picture: null,
    version: {
      hardware: '',
      software: '',
    },
    owner: null,
    roles: null,
  };
};

export const initDeviceAgg = (timestamp: FirebaseFirestore.FieldValue): DeviceAggProps => {
  return {
    timestamp,
    space: null,
    reading_total: 0,
    battery_percent: 0,
    charge: false,
  };
};
