export type DataPackage = {
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
