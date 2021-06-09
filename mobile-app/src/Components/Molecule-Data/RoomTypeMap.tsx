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
import {MapProps} from '../Atom-Icons/BaseIcons';
import {
  COLOUR_COTTON_CANDY,
  COLOUR_FLUFF,
  COLOUR_MINTED,
  COLOUR_SKY,
  COLOUR_SUNSHINE,
} from '@styles/Colours';

export const RoomTypeMap: Array<
  MapProps & {
    id: RoomType;
    colour: string;
  }
> = [
  {
    id: 'BEDROOM',
    icon: BedroomIcon,
    field: 'Bedroom',
    colour: COLOUR_COTTON_CANDY,
  },
  {
    id: 'GUEST',
    icon: BedroomIcon,
    field: 'Guestroom',
    colour: COLOUR_COTTON_CANDY,
  },
  {
    id: 'PLAY',
    icon: PlayroomIcon,
    field: 'Play Room',
    colour: COLOUR_COTTON_CANDY,
  },
  {id: 'OTHER', icon: OtherIcon, field: 'Other', colour: COLOUR_SUNSHINE},
  {
    id: 'KITCHEN',
    icon: KitchenIcon,
    field: 'Kitchen',
    colour: COLOUR_SKY,
  },
  {
    id: 'LIBRARY',
    icon: LibraryIcon,
    field: 'Library',
    colour: COLOUR_SUNSHINE,
  },
  {id: 'OFFICE', icon: OfficeIcon, field: 'Office', colour: COLOUR_SUNSHINE},
  {
    id: 'BALCONY',
    icon: BalconyIcon,
    field: 'Balcony',
    colour: COLOUR_MINTED,
  },
  {
    id: 'LIVING',
    icon: LivingRoomIcon,
    field: 'Living Room',
    colour: COLOUR_SUNSHINE,
  },
  {
    id: 'BATHROOM',
    icon: BathroomIcon,
    field: 'Bathroom',
    colour: COLOUR_FLUFF,
  },
  {
    id: 'DINING',
    icon: DiningRoomIcon,
    field: 'Dining Room',
    colour: COLOUR_SKY,
  },
  {
    id: 'FAMILY',
    icon: FamilyRoomIcon,
    field: 'Family Room',
    colour: COLOUR_SKY,
  },
];
