import {
  UserAggProps,
  UserProps,
  UserSettingsProps,
} from "@mimir/UserType";

export const initUserDoc = (
  displayName: string,
  email: string,
  timestamp: FirebaseFirestore.Timestamp
): UserProps => {
  return {
    username: displayName,
    date_created: timestamp,
    date_modified: null,
    profile_picture: { ref: "", thumb: "", url: "" },
    first_name: "",
    last_name: "",
    bio: "",
    location: {
      region: "",
      country: "",
      city: "",
      geo: null,
    },
    social_media: {
      facebook: "",
      instagram: "",
      twitter: "",
      email: email,
    },
  };
};

export const initUserSetting = (
  timestamp: FirebaseFirestore.Timestamp
): UserSettingsProps => {
  return {
    date_modified: timestamp,
    date_format: "dd/MM/yyyy",
    subscription: { start_date: null, end_date: null, type: "FREE" },
    unit_system: "METRIC",
  };
};

export const initUserAgg = (
  timestamp: FirebaseFirestore.Timestamp
): UserAggProps => {
  return {
    timestamp,
    space_total: 0,
    plant_total: 0,
    dead_total: 0,
    points: 0,
    level: 0,
  };
};
