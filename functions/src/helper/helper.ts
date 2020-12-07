import { Log } from '../types/GenericType';

export const aggSwitch = (
  total: number = 0,
  log: Log,
  doc_id: string,
  key: 'USER' | 'SPACE' | 'PLANT' | 'DEVICE' | 'DEAD'
): number => {
  switch (true) {
    case log.type.includes('USER_CREATED') && key === 'USER':
      return total + 1;
    case log.type.includes('SPACE_CREATED') && key === 'SPACE':
      return total + 1;
    case log.type.includes('PLANT_CREATED') && key === 'PLANT':
      return total + 1;
    case log.type.includes('PLANT_DIED') && key === 'PLANT':
      return total - 1;
    case log.type.includes('PLANT_DIED') && key === 'DEAD':
      return total - 1;
    case log.type.includes('DEVICE_REGISTERED') && key === 'DEVICE':
      return total + 1;
    default:
      return total;
  }
};
