import {
  Air,
  FirebaseTimestamp,
  Humidity,
  Light,
  Owner,
  Picture,
  Roles,
  Space,
  Temperature,
} from './GenericType';

export type PlantProps = {
  nickname: string;
  date_created: FirebaseTimestamp;
  date_modified: null | FirebaseTimestamp;
  description: string;
  picture: null | Picture;
  species: SpeciesType;
  form: FormType;
  pot: {
    size: number;
    type: PotType;
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
  owner: Owner;
  roles: Roles;
};

export type PlantInput = Omit<
  PlantProps,
  'date_created' | 'date_modified' | 'roles' | 'alive'
>;

export type PlantType = {
  nickname: string;
  id: string;
  botanical_name: string;
  type: PlantTypes;
  size: number;
};

export type SpeciesType = {
  family: string;
  genus: string;
  species: string;
  subspecies: string;
  cultivar: string;
  id: string;
  type: PlantTypes;
};

export type PotType =
  | 'TERRACOTTA'
  | 'WOODEN'
  | 'METAL'
  | 'PLASTIC'
  | 'FIBERGLASS'
  | 'CONCRETE'
  | 'FABRIC';

export type FormType =
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

export type PlantTypes =
  | 'GRASS'
  | 'CLIMBER'
  | 'CACTI'
  | 'BAMBOO'
  | 'GROUND_COVER'
  | 'ANNUAL'
  | 'HERBACEOUS'
  | 'BROADLEAF_EVERGREEN'
  | 'DECIDUOUS_SHRUB'
  | 'PERENNIAL_FLOWER'
  | 'BONSAI'
  | 'SEMI_EVERGREEN'
  | 'FERN'
  | 'PALM'
  | 'DECIDUOUS_TREE'
  | 'CONIFER'
  | 'AQUATIC'
  | 'UNKNOWN';

export type PlantCreateInput = Omit<
  PlantProps,
  'roles' | 'alive' | 'date_created' | 'date_modified'
>;

export type PlantAggProps = {
  timestamp: FirebaseTimestamp;
  space: null | Space;
  children_total: number;
  happiness_total: number;
  happiness_current: number;
  health_total: number;
  health_current: number;
  reading_total: number;
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
