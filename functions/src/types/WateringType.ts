import { FirebaseTimestamp, Note, Picture } from './GenericType';
import { PlantType } from './PlantType';
import { SpaceType } from './SpaceType';
import { UserType } from './UserType';

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
