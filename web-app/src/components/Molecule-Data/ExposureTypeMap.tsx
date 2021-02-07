import { ExposureTypes } from '../../types/SpeciesType';

export const ExposureTypeMap: Array<{ id: ExposureTypes; name: string }> = [
  { id: 'UNKNOWN', name: 'Unknown' },
  { id: 'DEEP_SHADE', name: 'Deep Shade' },
  { id: 'FILTERED_SHADE', name: 'Filtered Shade' },
  { id: 'FULL_SUN', name: 'Full Sun' },
  { id: 'PART_SHADE', name: 'Part Shade' },
  { id: 'SHELTERED', name: 'Sheltered' },
];
