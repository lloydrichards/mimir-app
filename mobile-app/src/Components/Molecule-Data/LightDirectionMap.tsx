import {LightType} from '@mimir/SpaceType';
import {
  EastIcon,
  NortheastIcon,
  NorthIcon,
  NorthwestIcon,
  SoutheastIcon,
  SouthIcon,
  SouthwestIcon,
  WestIcon,
} from '../Atom-Icons/LightDirection/SmallLightIcons';
import { MapProps } from '../Atom-Icons/BaseIcons';

export const LightDirectionMap: Array<MapProps & {id: LightType}> = [
  {id: 'S', icon: SouthIcon, field: 'South'},
  {
    id: 'SE',
    icon: SoutheastIcon,
    field: 'Southeast',
  },
  {id: 'E', icon: EastIcon, field: 'East'},
  {
    id: 'NE',
    icon: NortheastIcon,
    field: 'Northeast',
  },
  {id: 'N', icon: NorthIcon, field: 'North'},
  {
    id: 'NW',
    icon: NorthwestIcon,
    field: 'Northwest',
  },
  {id: 'W', icon: WestIcon, field: 'West'},
  {
    id: 'SW',
    icon: SouthwestIcon,
    field: 'Southwest',
  },
];
