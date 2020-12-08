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
  profile_picture: null | Picture;
  room_type:
    | 'BEDROOM'
    | 'GUEST'
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
  sun_exposure: 'SHADE' | 'HALF_SHADE' | 'FULL_SUN';
  location: Location;
  owner: Owner;
  roles: Roles;
};

export type SpaceCreateInput = Omit<SpaceProps, 'date_created' | 'date_modified' | 'roles'>;

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
