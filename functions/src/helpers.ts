export const reCalc = (
  oldMin: number,
  newMin: number,
  oldReadings: number,
  newReadings: number
): number => {
  const totalMin = oldMin * oldReadings + newMin * newReadings;
  const totalReadings = oldReadings + newReadings;
  return totalMin / totalReadings;
};

export const rangeFunc = (min: number, max: number, val: number) => {
  // Get the relative postion of the value between the extremes
  // If it is at the max then it will be 1
  // If it is at the min then it will be 0
  const position = (val - min) / (max - min);

  return position;
};
