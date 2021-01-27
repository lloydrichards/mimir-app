import { FirebaseTimestamp } from './GenericType';

export type SpeciesProps = {
  family: string;
  genus: string;
  species: string;
  subspecies: string | null;
  cultivar: string | null;
  description: string;
  common_name: Array<string>;
  type: Array<PlantType>;
  habitat: Array<HabitatType>;
  form: Array<FormType>;
  origin: Array<string>;
  edible: boolean;
  poisonous: boolean;
  pet_friendly: boolean;
  air_purifying: boolean;
  hardiness: Array<HardinessType>;
  exposure: Array<ExposureType>;
  soil: Array<SoilType>;
  water: Array<WaterType>;
  height_max: number | null;
  height_min: number | null;
  spread_min: number | null;
  spread_max: number | null;
  growth_rate: GrowthRateType | null;
  maintenance: MaintenanceType | null;
  pests: Array<PestType>;
};

export type ModelProps = {
  timestamp: FirebaseTimestamp;
  current: boolean;
  temperature: {
    min: number;
    optimal_low: number;
    optimal_high: number;
    max: number;
  };
  humidity: {
    min: number;
    optimal_low: number;
    optimal_high: number;
    max: number;
  };
  light: {
    low_min: number;
    low_max: number;
    medium_min: number;
    medium_max: number;
    bright_min: number;
    bright_max: number;
    full_min: number;
    full_max: number;
    lux_min: number;
    lux_max: number;
  };
  air: { max: number };
};

type PlantType =
  | 'ANNUAL'
  | 'AQUATIC_PLANT'
  | 'BAMBOO'
  | 'BIENNIAL'
  | 'BROADLEAF_EVERGREEN'
  | 'CONIFER'
  | 'FERN'
  | 'FLOWERING_CUT_PLANT'
  | 'FLOWERING_POT_PLANT'
  | 'GREENHOUSE_PRODUCE_PLANT'
  | 'GROUND_COVER'
  | 'HERBACEOUS_PERENNIAL'
  | 'INDOOR_FOLIAGE_PLANT'
  | 'INVASIVE_PLANT'
  | 'POALES_(GRASS-LIKE)'
  | 'SEMI-EVERGREEN'
  | 'SHRUB_DECIDUOUS'
  | 'TREE_DECIDUOUS'
  | 'WEED_(HORTICULTURAL)';

type FormType =
  | 'CREEPING_MAT-LIKE'
  | 'IRREGULAR'
  | 'MOUNDED'
  | 'OVAL_HORIZONTAL'
  | 'OVAL_VERTICAL'
  | 'PYRAMIDAL_NARROWLY'
  | 'PYRAMIDAL_WIDELY'
  | 'ROUND'
  | 'VASE'
  | 'WEEPING'
  | 'UNKNOWN';

type HabitatType =
  | 'ARCHING'
  | 'DENSE'
  | 'EPIPHYTIC'
  | 'FASTIGIATE'
  | 'HORIZONTAL'
  | 'IRREGULAR'
  | 'OPEN'
  | 'PENDULOUS'
  | 'SPREADING'
  | 'STIFFLY_UPRIGHT'
  | 'TWIGGY'
  | 'UPRIGHT'
  | 'UNKNOWN';

type GrowthRateType = 'FAST' | 'MODERATE' | 'UNKNOWN' | 'SLOW';

type HardinessType =
  | 'ZONE_1'
  | 'ZONE_10'
  | 'ZONE_11'
  | 'ZONE_2'
  | 'ZONE_3'
  | 'ZONE_4'
  | 'ZONE_5'
  | 'ZONE_6'
  | 'ZONE_7'
  | 'ZONE_8A'
  | 'ZONE_8B'
  | 'ZONE_9';

type ExposureType =
  | 'UNKNOWN'
  | 'DEEP_SHADE'
  | 'FILTERED_SHADE'
  | 'FULL_SUN'
  | 'PART_SHADE'
  | 'SHELTERED';

type SoilType =
  | 'UNKNOWN'
  | 'ACIDIC'
  | 'ALKALINE'
  | 'BOG'
  | 'DRY'
  | 'GRAVELLY'
  | 'HUMUS_RICH'
  | 'ROCKY'
  | 'WELL-DRAINED';

type WaterType =
  | 'AQUATIC'
  | 'HIGH'
  | 'LOW'
  | 'MODERATE'
  | 'UNKNOWN'
  | 'SUMMER_DRY'
  | 'WETLANDS'
  | 'WINTER_DRY';

type MaintenanceType = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
type PestType =
  | 'ABIOTIC_DISORDER'
  | 'ADELGIDS'
  | 'ANTHRACNOSE'
  | 'APHIDS'
  | 'BACTERIAL_LEAF_SPOT'
  | 'BEETLES'
  | 'BLIGHT'
  | 'CANKER'
  | 'CATERPILLAR'
  | 'CROWN_ROT'
  | 'CUTWORM'
  | 'DEER_RESISTANT'
  | 'DIEBACK'
  | 'DIPTERA_TRUE_FLIES'
  | 'DISEASE_RESISTANT'
  | 'DROUGHT_RESISTANT'
  | 'EARWIGS'
  | 'FUNGAL_LEAF_SPOT'
  | 'GALLS'
  | 'HEART_ROT'
  | 'HETEROPTERA_TRUE_BUGS'
  | 'LEAFHOPPER'
  | 'LEAF_MINER_INSECT'
  | 'LEAF_SCORCH'
  | 'MEALYBUGS'
  | 'MILDEW'
  | 'MISTLETOE'
  | 'MITES'
  | 'MOLD'
  | 'UNKNOWN'
  | 'NEEDLE_CAST'
  | 'NEMATODES'
  | 'PEST_RESISTANT'
  | 'PSYLLIDS'
  | 'RABBIT_RESISTANT'
  | 'RODENTS'
  | 'ROOT_ROT'
  | 'RUST'
  | 'SAP_ROT'
  | 'SAWFLIES'
  | 'SCALE_INSECTS'
  | 'SLUGS'
  | 'SNAILS'
  | 'SPITTLEBUG'
  | 'STEM_BORER_INSECTS'
  | 'THRIPS'
  | 'VIRUS'
  | 'WEEVILS'
  | 'WHITEFLY'
  | 'WILT'
  | 'WOOD_DEFORMITY';
