import { SvgIconProps } from '@material-ui/core/SvgIcon';
import firebase from 'firebase';


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

export type Note = {
  content: string;
  tags?: Array<{ [user_id: string]: string }>;
};

export type Location = {
  region: string;
  country: string;
  city: string;
  geo: null | firebase.firestore.GeoPoint;
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

export type FirebaseTimestamp = firebase.firestore.Timestamp;

export interface MapProps {
  id: string;
  field: string;
  icon: (props: SvgIconProps, colour: string) => JSX.Element;
}
