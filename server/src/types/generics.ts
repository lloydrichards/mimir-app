export type ProfilePicture = {
  url: string;
  ref: string;
  thumb: string;
};

export type Location = {
  region: string;
  country: string;
  city: string;
  address: string;
};

export type Owner = {
  name: string;
  email: string;
  id: string;
};

export type Roles = {
  [user_id: string]: 'ADMIN' | 'EDITOR' | 'GUEST';
};
