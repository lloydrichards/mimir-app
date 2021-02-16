import { FirebaseTimestamp, Note, Picture } from './GenericType';
import { PlantType } from './PlantType';
import { SpaceType } from './SpaceType';
import { UserType } from './UserType';

export type WateringProps = {
  timestamp: FirebaseTimestamp;
  created_by: UserType;
  space: SpaceType;
  plant_ids: Array<string>;
  plants: Array<PlantType>;
  fertilizer: boolean;
  pictures: Array<Picture>;
  note: Note;
};

export type WateringInputProps = Omit<WateringProps, 'created_by' | 'space'>;

export type WaterType = {
  id: string;
  created_by: UserType;
  fertilizer: boolean;
};
