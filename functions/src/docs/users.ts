export const initUserDoc = (
  email: string,
  timestamp: FirebaseFirestore.FieldValue
) => {
  return {
    username: email.split('@')[0],
    date_created: timestamp,
    date_modified: null,
    first_name: '',
    last_name: '',
    bio: '',
    gardener: 'BEGINNER',
    units: 'METRIC',
    subscription: 'FREE',
    location: {
      region: '',
      country: '',
      city: '',
    },
    social_media: {
      facebook: '',
      instagram: '',
      twitter: '',
      email: email,
    },
  };
};

export const initUserAgg = (timestamp: FirebaseFirestore.FieldValue) => {
  return {
    timestamp,
    space_total: 0,
    plant_total: 0,
    dead_total: 0,
    points: 0,
    level: 0,
  };
};
