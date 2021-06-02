import { ExposureTypes } from '@mimir/SpeciesType';

export const ExposureTypeMap: Array<{ id: ExposureTypes; field: string }> = [
  { id: 'UNKNOWN', field: 'Unknown' },
  { id: 'DEEP_SHADE', field: 'Deep Shade' },
  { id: 'FILTERED_SHADE', field: 'Filtered Shade' },
  { id: 'FULL_SUN', field: 'Full Sun' },
  { id: 'PART_SHADE', field: 'Part Shade' },
  { id: 'SHELTERED', field: 'Sheltered' },
];
