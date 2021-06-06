import { FirebaseTimestamp, Owner, Picture, Roles } from "./GenericType";
import { SpaceType } from "./SpaceType";

export type DeviceProps = {
  nickname: string;
  date_created: FirebaseTimestamp;
  date_registered: FirebaseTimestamp | null;
  date_modified: FirebaseTimestamp | null;
  last_updated: FirebaseTimestamp | null;
  description: string;
  version: {
    type: string;
    hardware: string;
    software: string;
  };
  update: {
    version: string;
    method: UpdateMethod;
  } | null;
  error: Array<ErrorType>;
  owner: null | Owner;
  roles: null | Roles;
};

export type DeviceRegisterInput = Omit<
  DeviceProps,
  | "date_created"
  | "date_modified"
  | "version"
  | "update"
  | "error"
  | "roles"
  | "last_updated"
> & { id: string };

export type DeviceType = {
  id: string;
  nickname: string;
  type: string;
};

export type ErrorType = "NO_CONNECTION";
export type UpdateMethod = "USB";

export type DeviceAggProps = {
  timestamp: FirebaseTimestamp;
  space: null | SpaceType;
  reading_total: number;
  battery_percent: number;
  charge: boolean;
};

export type DataPackageProps = {
  auth: Auth;
  status: Systems;
  data: EnvData;
};

interface Auth {
  user_id: string;
  device_id: string;
  email: string;
  macAddress: string;
}

interface Systems {
  date: string;
  time: string;
  bootCount: number;
  battery: number;
  wifi: number;
  sd: number;
  server: number;
  BME680: number;
  LSM303: number;
  SHT31: number;
  VEML6030: number;
  LC709: number;
  MODE: number;
}
interface EnvData {
  temperature: number;
  humidity: number;
  pressure: number;
  altitude: number;
  luminance: number;
  iaq: number;
  iaqAccuracy: number;
  eVOC: number;
  eCO2: number;
  bearing: number;
  batteryVoltage: number;
  batteryPercent: number;
}
