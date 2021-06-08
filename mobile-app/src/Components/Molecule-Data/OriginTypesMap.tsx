import {OriginTypes, ProblemTypes} from '@mimir/PlantType';

export const OriginTypesMap: Array<{id: OriginTypes; field: string}> = [
  {id: 'BOUGHT', field: 'Bought'},
  {id: 'GIFT_CUTTING', field: ' Gift (Cutting)'},
  {id: 'GIFT_PLANT', field: 'Gift (Plant)'},
  {id: 'PROPAGATED_CUTTING', field: 'Propagated (Cutting)'},
  {id: 'PROPAGATED_SEED', field: 'Propagated (Seed)'},
  {id: 'RESCUE', field: 'Rescue'},
  {id: 'UNKNOWN', field: 'Unknown'},
];
