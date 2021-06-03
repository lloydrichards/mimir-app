import {
  FirebaseTimestamp,
  Humidity,
  Light,
  Note,
  Owner,
  Picture,
  Roles,
  Temperature,
} from "./GenericType";
import { ProblemTypes } from "./InspectionType";
import { SpaceType } from "./SpaceType";
import { PestTypes, FormTypes } from "./SpeciesType";
import { UserType } from "./UserType";

export type PlantProps = {
  nickname: string;
  date_created: FirebaseTimestamp;
  date_modified: null | FirebaseTimestamp;
  description: string;
  picture: null | Picture;
  species: SpeciesType;
  form: FormTypes;
  alive: boolean;
  parent: null | {
    name: string;
    id: string;
    owner: Owner | null;
  };
  owner: Owner;
  roles: Roles;
};

export type PlantConfig = {
  timestamp: FirebaseTimestamp;
  current: boolean;
  problems: Array<ProblemTypes>;
  pests: Array<PestTypes>;
  pot: {
    size: number;
    type: PotType;
    tray: boolean;
    hanging: boolean;
  };
};

export type PlantDetailProps = PlantProps & {
  id: string;
  config?: PlantConfig & { id: string };
  aggs?: PlantAggProps & { id: string };
};

export type PlantInput = Omit<
  PlantProps,
  "date_created" | "date_modified" | "roles" | "alive"
>;

export type PlantType = {
  nickname: string;
  id: string;
  botanical_name: string;
  type: PlantTypes;
};

export type SpeciesType = {
  family: string;
  genus: string;
  species: string;
  subspecies: null | string;
  cultivar: null | string;
  id: string;
  type: PlantTypes;
};

export type PotType =
  | "TERRACOTTA"
  | "WOODEN"
  | "METAL"
  | "PLASTIC"
  | "FIBERGLASS"
  | "CONCRETE"
  | "FABRIC";

export type PlantTypes =
  | "GRASS"
  | "CLIMBER"
  | "CACTI"
  | "BAMBOO"
  | "GROUND_COVER"
  | "ANNUAL"
  | "HERBACEOUS"
  | "BROADLEAF_EVERGREEN"
  | "DECIDUOUS_SHRUB"
  | "PERENNIAL_FLOWER"
  | "BONSAI"
  | "SEMI_EVERGREEN"
  | "FERN"
  | "PALM"
  | "DECIDUOUS_TREE"
  | "CONIFER"
  | "AQUATIC"
  | "UNKNOWN";

export type PlantCreateInput = Omit<
  PlantProps,
  "roles" | "alive" | "date_created" | "date_modified"
>;

export type PlantAggProps = {
  timestamp: FirebaseTimestamp;
  children_total: number;
  happiness_total: number;
  happiness_current: number;
  health_total: number;
  health_current: number;
  inspection_total: number;
  watering_total: number;
  fertilizer_total: number;
  env: {
    reading_total: number;
    temperature: Temperature;
    humidity: Humidity;
    light: Light;
  };
};

export type WateringProps = {
  date_created: FirebaseTimestamp;
  created_by: UserType;
  space: SpaceType;
  plant_ids: Array<string>;
  plants: Array<PlantType>;
  fertilizer: boolean;
  pictures: Array<Picture>;
  note: Note;
};

export type WateringInput = Omit<WateringProps, "created_by" | "space">;

export type WaterType = {
  id: string;
  created_by: UserType;
  fertilizer: boolean;
};
