import { Owner, ProfilePicture, Roles, Location } from '../generics';

export type SpaceProps = {
  name: string;
  date_created: FirebaseFirestore.FieldValue;
  date_modified: string | null;
  description: string;
  profile_picture: ProfilePicture;
  room_type:
    | 'BEDROOM'
    | 'GUEST'
    | 'FAMILY'
    | 'DINING'
    | 'BATHROOM'
    | 'OFFICE'
    | 'LIVING'
    | 'BALCONY'
    | 'STORAGE'
    | 'LIBRARY'
    | 'KITCHEN'
    | 'OTHER';
  sun_exposure: 'SHADE' | 'HALF_SHADE' | 'FULL_SUN';
  location: Location;
  owner: Owner;
  roles: Roles;
};

export type SpaceCreateInput = Omit<
  SpaceProps,
  'date_created' | 'date_modified' | 'roles'
>;
