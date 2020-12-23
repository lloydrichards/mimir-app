export type Log = {
  timestamp: FirebaseTimestamp;
  type: Array<
    | 'USER_CREATED' //when a User is created
    | 'SPACE_CREATED' //when a Space is created
    | 'SPACE_UPDATED' //when a Space config is updated
    | 'SPACE_DELETED' //when a Space is deleted
    | 'PLANT_CREATED' //when a Plant is created
    | 'PLANT_CUTTING' //when a Plant is duplicated
    | 'PLANT_DIED' //when a Plant dies
    | 'PLANT_MOVED' //when a Plant is moved to new Space
    | 'PLANT_DELETED' //when a Plant is deleted
    | 'DEVICE_CREATED'
    | 'DEVICE_REGISTERED'
    | 'DEVICE_MOVED'
    | 'DEVICE_UPDATE'
    | 'DEVICE_DELETED'
    | 'WATERING'
    | 'INSPECTION'
    | 'POINTS'
  >;
  content: {
    user_id?: string;
    user_email?: string;
    space_id?: string;
    space_type?: string;
    space_name?: string;
    plant_id?: string;
    device_id?: string;
    readings?: number;
    toSpace_id?: string;
    fromSpace_id?: string;
    points?: number;
    health?: number;
    happiness?: number;
    fertilizer?: boolean;
    temperature?: Temperature;
    humidity?: Humidity;
    light?: Light;
    ait?: Air;
    battery_percent?: number;
  };
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
};

export type Space = {
  name: string;
  type: string;
  id: string;
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

export type FirebaseTimestamp = FirebaseFirestore.Timestamp;
