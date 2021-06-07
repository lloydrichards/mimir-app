import {RoomType} from '@mimir/SpaceType';
import {
  BedroomIcon,
  PlayroomIcon,
  OtherIcon,
  KitchenIcon,
  LibraryIcon,
  OfficeIcon,
  BalconyIcon,
  LivingRoomIcon,
  BathroomIcon,
  DiningRoomIcon,
  FamilyRoomIcon,
} from '../Atom-Icons/RoomTypeIcons';
import {MapProps} from '../Atom-Icons/SmallIcon';

export const RoomTypeMap: Array<
  MapProps & {
    id: RoomType;
  }
> = [
  {
    id: 'BEDROOM',
    icon: BedroomIcon,
    field: 'Bedroom',
  },
  {
    id: 'GUEST',
    icon: BedroomIcon,
    field: 'Guestroom',
  },
  {
    id: 'PLAY',
    icon: PlayroomIcon,
    field: 'Play Room',
  },
  {id: 'OTHER', icon: OtherIcon, field: 'Other'},
  {
    id: 'KITCHEN',
    icon: KitchenIcon,
    field: 'Kitchen',
  },
  {
    id: 'LIBRARY',
    icon: LibraryIcon,
    field: 'Library',
  },
  {id: 'OFFICE', icon: OfficeIcon, field: 'Office'},
  {
    id: 'BALCONY',
    icon: BalconyIcon,
    field: 'Balcony',
  },
  {
    id: 'LIVING',
    icon: LivingRoomIcon,
    field: 'Living Room',
  },
  {
    id: 'BATHROOM',
    icon: BathroomIcon,
    field: 'Bathroom',
  },
  {
    id: 'DINING',
    icon: DiningRoomIcon,
    field: 'Dining Room',
  },
  {
    id: 'FAMILY',
    icon: FamilyRoomIcon,
    field: 'Family Room',
  },
];
