import {
  Owner,
  Picture,
  Roles,
  Location,
  Temperature,
  Humidity,
  Light,
  Air,
} from './GenericType';

export type SpaceProps = {
  name: string;
  date_created: FirebaseFirestore.FieldValue;
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

export type SpaceCreateInput = Omit<
  SpaceProps,
  'date_created' | 'date_modified' | 'roles'
>;

export type SpaceConfigProps = {
  timestamp: FirebaseFirestore.FieldValue;
  current: boolean;
  device: Array<string>;
  plants: Array<PlantsConfig>;
};

export interface PlantsConfig {
  nickname: string;
  botanical_name: string;
  type: string;
  size: string;
}
export type SpaceAggProps = {
  timestamp: FirebaseFirestore.FieldValue;
  reading_total: number;
  plant_total: number;
  dead_total: number;
  inspection_total: number;
  inspection_last: null | FirebaseFirestore.FieldValue;
  watering_total: number;
  watering_last: FirebaseFirestore.FieldValue;
  fertilizer_last: FirebaseFirestore.FieldValue;
  temperature: Temperature;
  humidity: Humidity;
  light: Light;
  air: Air;
};
