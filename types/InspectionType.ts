import { FirebaseTimestamp, Note, Picture } from './GenericType';
import { PlantType } from './PlantType';
import { SpaceType } from './SpaceType';
import { PestTypes } from './SpeciesType';
import { UserType } from './UserType';

export type InspectionProps = {
  timestamp: FirebaseTimestamp;
  created_by: UserType;
  space: SpaceType;
  plant: PlantType;
  happiness: number;
  health: number;
  leafing: boolean;
  flowering: boolean;
  fruiting: boolean;
  root_bound: boolean;
  problems: Array<ProblemTypes>;
  pests: Array<PestTypes>;
  pictures: Array<Picture>;
  note: Note;
};

export type InspectionInput = Omit<
  InspectionProps,
  'created_by' | 'space' | 'plant'
>;

export type ProblemTypes =
  | 'LEAF_WILTED'
  | 'LEAF_DISCOLOUR'
  | 'LEAF_DROP'
  | 'STEM_SOFT'
  | 'STEM_DISCOLOUR'
  | 'STEM_BORE'
  | 'FLOWER_DROP'
  | 'FLOWER_WILTING'
  | 'FRUIT_DISCOLOUR'
  | 'FRUIT_DROP'
  | 'FRUIT_BORE'
  | 'MOLD';

  export type InspectionType = {
    id: string;
    created_by: UserType;
    happiness: number;
    health: number;
    leafing: boolean;
    flowering: boolean;
    fruiting: boolean;
    root_bound: boolean;
    problems: Array<ProblemTypes>;
    pests: Array<PestTypes>;
  };
  