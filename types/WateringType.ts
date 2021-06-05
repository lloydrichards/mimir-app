import { FirebaseTimestamp, Note, Picture } from "./GenericType";
import { PlantType } from "./PlantType";
import { SpaceType } from "./SpaceType";
import { UserType } from "./UserType";

export type WateringProps = {
  date_created: FirebaseTimestamp;
  created_by: UserType;
  space: SpaceType;
  plant: PlantType;
  fertilizer: boolean;
};

export type WateringInput = Omit<
  WateringProps,
  "created_by" | "space" | "plant"
>;

export type WaterType = {
  id: string;
  created_by: UserType;
  fertilizer: boolean;
};
