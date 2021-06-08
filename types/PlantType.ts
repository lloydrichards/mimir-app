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
  origin: OriginTypes;
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
  plant: PlantType;
  happiness: number;
  health: number;
  leafing: boolean;
  flowering: boolean;
  fruiting: boolean;
  root_bound: boolean;
  problems: Array<ProblemTypes>;
  pests: Array<PestTypes>;
  pot: PotType;
};

export type PotType = {
  size: number;
  type: PotTypes;
  tray: boolean;
  hanging: boolean;
};

export type PlantDetailProps = PlantProps & {
  id: string;
  config?: PlantConfig & { id: string };
  aggs?: PlantAggProps & { id: string };
  watering?: WateringProps & { id: string };
  space?: SpaceType;
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

export type OriginTypes =
  | "BOUGHT"
  | "PROPAGATED_CUTTING"
  | "PROPAGATED_SEED"
  | "GIFT_PLANT"
  | "GIFT_CUTTING"
  | "RESCUE"
  | "UNKNOWN";

export type PotTypes =
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

export type ProblemTypes =
  | "LEAF_WILTED"
  | "LEAF_DISCOLOUR"
  | "LEAF_DROP"
  | "STEM_SOFT"
  | "STEM_DISCOLOUR"
  | "STEM_BORE"
  | "FLOWER_DROP"
  | "FLOWER_WILTING"
  | "FRUIT_DISCOLOUR"
  | "FRUIT_DROP"
  | "FRUIT_BORE"
  | "MOLD";

export type PlantCreateInput = Omit<
  PlantProps,
  "roles" | "alive" | "date_created" | "date_modified"
>;

export type PlantAggProps = {
  timestamp: FirebaseTimestamp;
  children_total: number;
  happiness_total: number;
  health_total: number;
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
  timestamp: FirebaseTimestamp;
  created_by: UserType;
  space: SpaceType;
  plant: PlantType;
  fertilizer: boolean;
};

export type WateringInput = Omit<
  WateringProps,
  "created_by" | "plant" | "space"
>;

export type WaterType = {
  id: string;
  created_by: UserType;
  fertilizer: boolean;
};

export type InspectionType = {
  happiness: number;
  health: number;
  leafing: boolean;
  flowering: boolean;
  fruiting: boolean;
  root_bound: boolean;
  problems: Array<ProblemTypes>;
  pests: Array<PestTypes>;
};
