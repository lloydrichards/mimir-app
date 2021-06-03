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
  units: "METRIC" | "IMPERIAL";
  subscription: "FREE" | "PREMIUM" | "BETA";
};

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
