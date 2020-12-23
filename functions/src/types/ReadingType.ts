import { FirebaseTimestamp } from './GenericType';

export type ReadingProps = {
  user_id: string;
  device_id: string;
  space_ids: Array<string>;
  plants_ids: Array<string>;
  species_ids: Array<string>;
  timestamp: FirebaseTimestamp;
  bootCount: number;
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
};
