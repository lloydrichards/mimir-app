import { OverrideProps } from '@material-ui/core/OverridableComponent';
import {
  SvgIconTypeMap,
} from '@material-ui/core/SvgIcon';
import { RoomType } from '../../types/SpaceType';
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

export const RoomTypeMap: Array<{
  id: RoomType;
  icon: (
    props?: OverrideProps<SvgIconTypeMap<{}, 'svg'>, 'svg'> | undefined,
    colour?: string | undefined
  ) => JSX.Element;
  field: string;
}> = [
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
  { id: 'OTHER', icon: OtherIcon, field: 'Other' },
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
  { id: 'OFFICE', icon: OfficeIcon, field: 'Office' },
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
