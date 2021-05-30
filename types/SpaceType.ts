import {
  Owner,
  Picture,
  Roles,
  Location,
  Temperature,
  Humidity,
  Light,
  Air,
  FirebaseTimestamp,
} from "./GenericType";
import { PlantProps, PlantType } from "./PlantType";
import { DailyProps } from "./ReadingType";

export type SpaceProps = {
  name: string;
  date_created: FirebaseTimestamp;
  date_modified: string | null;
  description: string;
  picture: null | Picture;
  room_type: RoomType;
  light_direction: Array<LightType>;
  location: Location;
  owner: Owner;
  roles: Roles;
};

export type SpaceInput = Omit<
  SpaceProps,
  "date_created" | "date_modified" | "roles"
>;

export type SpaceType = {
  id: string;
  name: string;
  room_type: RoomType;
  light_direction: Array<LightType>;
  thumb: string;
};

export type SpaceDetailProps = SpaceProps & {
  id: string;
  config: SpaceConfigProps & { id: string };
  aggs: SpaceAggProps & { id: string };
  plants: Array<PlantProps & { id: string }>;
  daily: Array<DailyProps & { id: string }>;
};

export type RoomType =
  | "BEDROOM"
  | "GUEST"
  | "PLAY"
  | "FAMILY"
  | "DINING"
  | "BATHROOM"
  | "OFFICE"
  | "LIVING"
  | "BALCONY"
  | "STORAGE"
  | "LIBRARY"
  | "KITCHEN"
  | "OTHER";

export type SpaceCreateInput = Omit<
  SpaceProps,
  "date_created" | "date_modified" | "roles"
>;

export type LightType = "S" | "SE" | "E" | "NE" | "N" | "NW" | "W" | "SW";

export type SpaceConfigProps = {
  timestamp: FirebaseTimestamp;
  current: boolean;
  devices: Array<string>;
  plant_ids: Array<string>;
  plants: Array<PlantType>;
  diseases: Array<string>;
};

export type SpaceAggProps = {
  timestamp: FirebaseTimestamp;
  reading_total: number;
  plant_total: number;
  dead_total: number;
  inspection_total: number;
  inspection_last: null | FirebaseTimestamp;
  watering_total: number;
  watering_last: null | FirebaseTimestamp;
  fertilizer_last: null | FirebaseTimestamp;
  temperature: Temperature;
  humidity: Humidity;
  light: Light;
  air: Air;
};
