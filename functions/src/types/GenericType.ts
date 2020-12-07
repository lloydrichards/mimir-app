export type Log = {
  timestamp: FirebaseFirestore.FieldValue;
  type: Array<
    | 'USER_CREATED'
    | 'PLANT_CREATED'
    | 'SPACE_CREATED'
    | 'DEVICE_CREATED'
    | 'PLANT_DIED'
    | 'DEVICE_REGISTERED'
  >;
  content: { [key: string]: any };
};
export type Picture = {
  url: string;
  ref: string;
  thumb: string;
};

export type Owner = {
  name: string;
  email: string;
  id: string;
};

export type Roles = {
  [user_id: string]: 'ADMIN' | 'EDITOR' | 'GUEST';
};

export type Location = {
  region: string;
  country: string;
  city: string;
  address: string;
};

export type Temperature = {
  max: number;
  avg: number;
  min: number;
};
export type Humidity = {
  max: number;
  avg: number;
  min: number;
};

export type Light = {
  shade: number;
  half_shade: number;
  full_sun: number;
  avg: number;
  max: number;
};

export type Air = {
  avg: number;
  max: number;
};
