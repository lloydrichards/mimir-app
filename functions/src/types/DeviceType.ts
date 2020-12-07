import { Owner, Picture, Roles } from './GenericType';

export type DeviceProps = {
  nickname: string;
  date_created: FirebaseFirestore.FieldValue;
  date_modified: string | null;
  description: string;
  profile_picture: null | Picture;
  version: {
    hardware: string;
    software: string;
  };
  owner: Owner;
  roles: Roles;
};

export type DeviceRegisterInput = Omit<
  DeviceProps,
  'date_created' | 'date_modified' | 'roles'
>;

export type DeviceAggProps = {
  timestamp: FirebaseFirestore.FieldValue;
  space: {
    name: string;
    room_type: string;
    id: string;
  };
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
