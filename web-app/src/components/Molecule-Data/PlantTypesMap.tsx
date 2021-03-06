import { SvgIconTypeMap } from '@material-ui/core';
import { OverrideProps } from '@material-ui/core/OverridableComponent';
import { PlantTypes } from '../../types/PlantType';
import {
  AnnualIcon,
  AquaticIcon,
  BambooIcon,
  BonsaiIcon,
  BroadleadEvergreenIcon as BroadleafEvergreenIcon,
  CactiIcon,
  ClimberIcon,
  ConiferIcon,
  DeciduousShrubIcon,
  DeciduousTreeIcon,
  FernIcon,
  GrassIcon,
  GroundCoverIcon,
  HerbaceousIcon,
  PalmIcon,
  PerennialFlowerIcon,
  SemiEvergreenIcon,
  UnknownPlantIcon,
} from '../Atom-Icons/PlantTypes/Icon24px';

export const PlantTypesMap: Array<{
  id: PlantTypes;
  icon: (
    props?: OverrideProps<SvgIconTypeMap<{}, 'svg'>, 'svg'> | undefined,
    colour?: string | undefined
  ) => JSX.Element;
  name: string;
}> = [
  { id: 'GRASS', icon: GrassIcon, name: 'Grass' },
  { id: 'CLIMBER', icon: ClimberIcon, name: 'Climber' },
  { id: 'CACTI', icon: CactiIcon, name: 'Cacti' },
  { id: 'BAMBOO', icon: BambooIcon, name: 'Bamboo' },
  { id: 'GROUND_COVER', icon: GroundCoverIcon, name: 'Ground Cover' },
  { id: 'ANNUAL', icon: AnnualIcon, name: 'Annual' },
  { id: 'HERBACEOUS', icon: HerbaceousIcon, name: 'Herbaceous' },
  {
    id: 'BROADLEAF_EVERGREEN',
    icon: BroadleafEvergreenIcon,
    name: 'Broadleaf Evergreen',
  },
  { id: 'DECIDUOUS_SHRUB', icon: DeciduousShrubIcon, name: 'Deciduous Shrub' },
  {
    id: 'PERENNIAL_FLOWER',
    icon: PerennialFlowerIcon,
    name: 'Perennial Flower',
  },
  { id: 'BONSAI', icon: BonsaiIcon, name: 'Bonsai' },
  { id: 'SEMI_EVERGREEN', icon: SemiEvergreenIcon, name: 'Semi Evergreen' },
  { id: 'FERN', icon: FernIcon, name: 'Fern' },
  { id: 'PALM', icon: PalmIcon, name: 'Palm' },
  { id: 'DECIDUOUS_TREE', icon: DeciduousTreeIcon, name: 'Deciduous Tree' },
  { id: 'CONIFER', icon: ConiferIcon, name: 'Conifer' },
  { id: 'AQUATIC', icon: AquaticIcon, name: 'Aquatic' },
  { id: 'UNKNOWN', icon: UnknownPlantIcon, name: 'Unknown' },
];
