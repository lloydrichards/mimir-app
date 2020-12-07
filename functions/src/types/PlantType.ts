import {
  Air,
  Humidity,
  Light,
  Owner,
  Picture,
  Roles,
  Temperature,
} from './GenericType';

export type PlantProps = {
  nickname: string;
  date_created: FirebaseFirestore.FieldValue;
  date_modified: null | FirebaseFirestore.FieldValue;
  description: string;
  profile_picture: null | Picture;
  species: {
    family: string;
    genus: string;
    species: string;
    subspecies: string;
    cultivar: string;
    id: string;
  };
  form:
    | 'CREEPING'
    | 'IRREGULAR'
    | 'MOUNDED'
    | 'OVAL'
    | 'PYRAMIDAL'
    | 'ROUND'
    | 'VASE'
    | 'WEEPING'
    | 'CLIMBING'
    | 'COLUMNAR';
  pot: {
    size: number;
    type:
      | 'TERRACOTTA'
      | 'WOODEN'
      | 'METAL'
      | 'PLASTIC'
      | 'FIBERGLASS'
      | 'CONCRETE'
      | 'FABRIC';
    tray: boolean;
    hanging: boolean;
  };
  alive: boolean;
  parent: null | {
    name: string;
    id: string;
    owner_name: string;
    owner_id: string;
  };
  owner: null | Owner;
  roles: Roles;
};

export type PlantCreateInput = Omit<
  PlantProps,
  'roles' | 'alive' | 'date_created' | 'date_modified'
>;

export type PlantAggProps = {
  timestamp: FirebaseFirestore.FieldValue;
  space: { name: string; type: string; id: string };
  children_total: number;
  happiness_total: number;
  happiness_current: number;
  health_total: number;
  health_current: number;
  reading_total: number;
  inspection_total: number;
  inspection_last: null | FirebaseFirestore.FieldValue;
  watering_total: number;
  watering_last: null | FirebaseFirestore.FieldValue;
  fertilizer_last: null | FirebaseFirestore.FieldValue;
  temperature: Temperature;
  humidity: Humidity;
  light: Light;
  air: Air;
};
