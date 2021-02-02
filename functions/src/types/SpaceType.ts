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
} from './GenericType';

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

export type RoomType =
  | 'BEDROOM'
  | 'GUEST'
  | 'PLAY'
  | 'FAMILY'
  | 'DINING'
  | 'BATHROOM'
  | 'OFFICE'
  | 'LIVING'
  | 'BALCONY'
  | 'STORAGE'
  | 'LIBRARY'
  | 'KITCHEN'
  | 'OTHER';

export type SpaceCreateInput = Omit<
  SpaceProps,
  'date_created' | 'date_modified' | 'roles'
>;

export type LightType = 'S' | 'SE' | 'E' | 'NE' | 'N' | 'NW' | 'W' | 'SW';

export type SpaceConfigProps = {
  timestamp: FirebaseTimestamp;
  current: boolean;
  devices: Array<string>;
  plant_ids: Array<null | string>;
  plants: Array<null | PlantsConfig>;
  diseases: Array<null | string>;
};

export interface PlantsConfig {
  nickname: string;
  id: string;
  botanical_name: string;
  type: string;
  size: string;
}
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
