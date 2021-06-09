import {PlantTypes} from '@mimir/PlantType';
import {SvgProps} from 'react-native-svg';
import {
  AnnualIcon,
  AquaticIcon,
  BambooIcon,
  BonsaiIcon,
  BroadleafEvergreenIcon,
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
} from '../Atom-Icons/PlantTypes/SmallPlantIcons';
import {MapProps} from '../Atom-Icons/BaseIcons';

export const PlantTypesMap: Array<
  MapProps & {
    id: PlantTypes;
  }
> = [
  {id: 'GRASS', icon: GrassIcon, field: 'Grass'},
  {id: 'CLIMBER', icon: ClimberIcon, field: 'Climber'},
  {id: 'CACTI', icon: CactiIcon, field: 'Cacti'},
  {id: 'BAMBOO', icon: BambooIcon, field: 'Bamboo'},
  {id: 'GROUND_COVER', icon: GroundCoverIcon, field: 'Ground Cover'},
  {id: 'ANNUAL', icon: AnnualIcon, field: 'Annual'},
  {id: 'HERBACEOUS', icon: HerbaceousIcon, field: 'Herbaceous'},
  {
    id: 'BROADLEAF_EVERGREEN',
    icon: BroadleafEvergreenIcon,
    field: 'Broadleaf Evergreen',
  },
  {id: 'DECIDUOUS_SHRUB', icon: DeciduousShrubIcon, field: 'Deciduous Shrub'},
  {
    id: 'PERENNIAL_FLOWER',
    icon: PerennialFlowerIcon,
    field: 'Perennial Flower',
  },
  {id: 'BONSAI', icon: BonsaiIcon, field: 'Bonsai'},
  {id: 'SEMI_EVERGREEN', icon: SemiEvergreenIcon, field: 'Semi Evergreen'},
  {id: 'FERN', icon: FernIcon, field: 'Fern'},
  {id: 'PALM', icon: PalmIcon, field: 'Palm'},
  {id: 'DECIDUOUS_TREE', icon: DeciduousTreeIcon, field: 'Deciduous Tree'},
  {id: 'CONIFER', icon: ConiferIcon, field: 'Conifer'},
  {id: 'AQUATIC', icon: AquaticIcon, field: 'Aquatic'},
  {id: 'UNKNOWN', icon: UnknownPlantIcon, field: 'Unknown'},
];
