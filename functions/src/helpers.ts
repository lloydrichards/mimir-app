export const reCalc = (
  oldMin: number,
  newMin: number,
  oldReadings: number,
  newReadings: number
): number => {
  const totalMin = oldMin * oldReadings + newMin;
  const totalReadings = oldReadings + newReadings;
  return totalMin / totalReadings;
};
