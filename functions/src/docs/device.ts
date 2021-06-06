import { DeviceAggProps, DeviceProps } from "@mimir/DeviceType";

export const initDeviceAgg = (
  timestamp: FirebaseFirestore.Timestamp
): DeviceAggProps => {
  return {
    timestamp,
    space: null,
    reading_total: 0,
    battery_percent: 0,
    charge: false,
  };
};
