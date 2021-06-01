import { ProblemTypes } from '@mimir/InspectionType';

export const PromblemTypesMap: Array<{ id: ProblemTypes; name: string }> = [
  { id: 'LEAF_WILTED', name: 'Wilted Leaves' },
  { id: 'LEAF_DISCOLOUR', name: 'Discoloured Leaves' },
  { id: 'LEAF_DROP', name: 'Dropped Leaves' },
  { id: 'STEM_SOFT', name: 'Squishy Stem' },
  { id: 'STEM_DISCOLOUR', name: 'Discoloured Stem' },
  { id: 'STEM_BORE', name: 'Chewed Stem' },
  { id: 'FLOWER_DROP', name: 'Dropped Flowers' },
  { id: 'FLOWER_WILTING', name: 'Wilted Flowers' },
  { id: 'FRUIT_DISCOLOUR', name: 'Discoloured Flowers' },
  { id: 'FRUIT_DROP', name: 'Dropped Fruit' },
  { id: 'FRUIT_BORE', name: 'Chewed Fruit' },
  { id: 'MOLD', name: 'Mold' },
];
