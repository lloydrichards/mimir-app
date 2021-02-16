import {
  FirebaseTimestamp,
  Temperature,
  Humidity,
  Light,
  Air,
} from './GenericType';
import { InspectionType } from './InspectionType';
import { PlantType } from './PlantType';
import { DailyProps, DailyType } from './ReadingType';
import { SpaceType } from './SpaceType';
import { UserType } from './UserType';
import { WaterType } from './WateringType';

export type Log = {
  timestamp: FirebaseTimestamp;
  type: Array<LogTypes>;
  content: {
    user?: UserType;
    space?: SpaceType;
    plant?: PlantType;
    device_id?: string;
    readings?: number;
    toSpace?: SpaceType;
    fromSpace?: SpaceType;
    points?: number;
    water?: WaterType;
    daily?: DailyType;
    inspection?: InspectionType;
    temperature?: Temperature;
    humidity?: Humidity;
    light?: Light;
    ait?: Air;
    battery_percent?: number;
  };
};

export type LogTypes =
  | 'USER_CREATED' //when a User is created
  | 'USER_UPDATED'
  | 'SPACE_CREATED' //when a Space is created
  | 'SPACE_UPDATED' //when a Space config is updated
  | 'SPACE_DELETED' //when a Space is deleted
  | 'PLANT_CREATED' //when a Plant is created
  | 'PLANT_UPDATED'
  | 'PLANT_CUTTING' //when a Plant is duplicated
  | 'PLANT_DIED' //when a Plant dies
  | 'PLANT_MOVED' //when a Plant is moved to new Space
  | 'PLANT_DELETED' //when a Plant is deleted
  | 'DEVICE_CREATED'
  | 'DEVICE_REGISTERED'
  | 'DEVICE_MOVED'
  | 'DEVICE_UPDATE'
  | 'DEVICE_DELETED'
  | 'WATERING'
  | 'INSPECTION'
  | 'POINTS';
