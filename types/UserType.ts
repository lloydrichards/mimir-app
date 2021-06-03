import { FirebaseTimestamp, Location, Picture } from "./GenericType";

export type UserProps = {
  username: string;
  date_created: FirebaseTimestamp;
  date_modified: null | FirebaseTimestamp;
  first_name: string;
  last_name: string;
  bio: string;
  location: Location;
  profile_picture: Picture;
  social_media: {
    facebook: string;
    instagram: string;
    twitter: string;
    email: string;
  };
};

export type UserDetailProps = UserProps & {
  id: string;
  aggs?: UserAggProps & { id: string };
  settings: UserSettingsProps;
};

export type UserSettingsProps = {
  date_modified: FirebaseTimestamp;
  date_format: DateFormatTypes;
  unit_system: UnitTypes;
  subscription: {
    start_date: FirebaseTimestamp | null;
    end_date: FirebaseTimestamp | null;
    type: SubscriptionTypes;
  };
};

export type UnitTypes = "METRIC" | "IMPERIAL";
export type SubscriptionTypes = "FREE" | "PREMIUM" | "BETA";

export type DateFormatTypes = "dd/MM/yyyy" | "MM/dd/yyyy";

export type UserType = {
  id: string;
  username: string;
};
export type UserAggProps = {
  timestamp: FirebaseTimestamp;
  space_total: number;
  plant_total: number;
  dead_total: number;
  points: number;
  level: number;
};

export type UserStatsProps = {
  timestamp: FirebaseTimestamp;
  users_total: number | FirebaseFirestore.FieldValue;
  date_format: {
    [key in DateFormatTypes]?: number;
  };
  subscription: {
    [key in SubscriptionTypes]?: number;
  };
  unit_system: {
    [key in UnitTypes]?: number;
  };
  users_level: {
    [x: number]: number | FirebaseFirestore.FieldValue;
  };
};
