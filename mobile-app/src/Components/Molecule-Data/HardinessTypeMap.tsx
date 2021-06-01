import { HardinessTypes } from '@mimir/SpeciesType';

export const HardinessTypeMap: Array<{
  id: HardinessTypes;
  name: string;
  low: number;
  high: number;
}> = [
  { id: 'ZONE_1', name: 'Zone 1', low: -51.1, high: -45.6 },
  { id: 'ZONE_2', name: 'Zone 2', low: -45.6, high: -40 },
  { id: 'ZONE_3', name: 'Zone 3', low: -40, high: -34.4 },
  { id: 'ZONE_4', name: 'Zone 4', low: -34.4, high: -28.9 },
  { id: 'ZONE_5', name: 'Zone 5', low: -28.9, high: -23.3 },
  { id: 'ZONE_6', name: 'Zone 6', low: -23.3, high: -17.8 },
  { id: 'ZONE_7', name: 'Zone 7', low: -17.8, high: -12.2 },
  { id: 'ZONE_8A', name: 'Zone 8a', low: -12.2, high: -9.4 },
  { id: 'ZONE_8B', name: 'Zone 8b', low: -9.4, high: -6.7 },
  { id: 'ZONE_9', name: 'Zone 9', low: -6.7, high: 1.1 },
  { id: 'ZONE_10', name: 'Zone 10', low: -1.1, high: 4.4 },
  { id: 'ZONE_11', name: 'Zone 11', low: 4.4, high: 10 },
  { id: 'ZONE_12', name: 'Zone 11', low: 10, high: 15.6 },
  { id: 'ZONE_13', name: 'Zone 11', low: 15.6, high: 21.1 },
];
