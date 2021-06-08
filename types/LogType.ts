import { DeviceType } from "./DeviceType";
import { FirebaseTimestamp, Temperature, Humidity, Light } from "./GenericType";
import { InspectionType, PlantType, WaterType } from "./PlantType";
import { DailyType } from "./ReadingType";
import { SpaceType } from "./SpaceType";
import { UserType } from "./UserType";

export type Log = {
  timestamp: FirebaseTimestamp;
  type: Array<LogTypes>;
  content: {
    fromUser?: UserType;
    user?: UserType;
    space?: SpaceType;
    plant?: PlantType;
    device?: DeviceType;
    readings?: number;
    toSpace?: SpaceType;
    fromSpace?: SpaceType;
    points?: number;
    water?: WaterType;
    oldWater?: WaterType;
    daily?: DailyType;
    inspection?: InspectionType;
    oldInspection?: InspectionType;
    battery_percent?: number;
  };
};

export type LogTypes =
  | "USER_CREATED" // when a User is created
  | "USER_UPDATED"
  | "USER_INVITED"
  | "SPACE_CREATED" // when a Space is created
  | "SPACE_UPDATED" // when a Space config is updated
  | "SPACE_DELETED" // when a Space is deleted
  | "PLANT_CREATED" // when a Plant is created
  | "PLANT_UPDATED"
  | "PLANT_CUTTING" // when a Plant is duplicated
  | "PLANT_DIED" // when a Plant dies
  | "PLANT_MOVED" // when a Plant is moved to new Space
  | "PLANT_DELETED" // when a Plant is deleted
  | "DEVICE_REGISTERED"
  | "DEVICE_MOVED"
  | "DEVICE_UPDATE"
  | "DEVICE_DELETED"
  | "WATERING_CREATED"
  | "WATERING_UPDATED"
  | "WATERING_DELETED"
  | "INSPECTION_CREATED"
  | "INSPECTION_UPDATED"
  | "INSPECTION_DELETED"
  | "POINTS";
