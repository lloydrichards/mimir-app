import { UserAggProps, UserProps, UserSettingsProps } from '../types/UserType';

export const initUserDoc = (
  email: string,
  timestamp: FirebaseFirestore.Timestamp
): UserProps => {
  return {
    username: email.split('@')[0],
    date_created: timestamp,
    date_modified: null,
    profile_picture: { ref: '', thumb: '', url: '' },
    first_name: '',
    last_name: '',
    bio: '',
    gardener: 'BEGINNER',
    location: {
      region: '',
      country: '',
      city: '',
      geo: null,
    },
    social_media: {
      facebook: '',
      instagram: '',
      twitter: '',
      email: email,
    },
  };
};

export const initUserSetting = (
  timestamp: FirebaseFirestore.Timestamp
): UserSettingsProps => {
  return {
    date_modified: timestamp,
    date_format: 'dd/MM/yyyy',
    subscription: 'FREE',
    units: 'METRIC',
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
