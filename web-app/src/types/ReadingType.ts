import {
  Air,
  FirebaseTimestamp,
  Humidity,
  Light,
  Temperature,
} from './GenericType';

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

export type DailyProps = {
  timestamp: FirebaseTimestamp;
  temperature: Temperature;
  humidity: Humidity;
  air: Air;
  light: Light;
  data: {
    [hour: string]: {
      timestamp: FirebaseTimestamp;
      eVOC: number;
      iaq: number;
      humidity: number;
      eCO2: number;
      luminance: number;
      total: number;
      temperature: number;
    };
  };
};

export type DailyType = {
  readings: number;
  batteryPercent: number;
  temperature: Temperature;
  humidity: Humidity;
  air: Air;
  light: Light;
};
