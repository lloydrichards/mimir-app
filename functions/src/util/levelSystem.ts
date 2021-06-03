export const levelUp = (points: number): number => {
  return points <= 10
    ? 1
    : points <= 25
    ? 2
    : points <= 50
    ? 3
    : points <= 100
    ? 4
    : points <= 250
    ? 5
    : points <= 500
    ? 6
    : points <= 1000
    ? 7
    : points <= 2500
    ? 8
    : points <= 10000
    ? 9
    : 10;
};
