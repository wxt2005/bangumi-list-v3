export default function quarterToMonth(quarter: number): number {
  switch (quarter) {
    case 1:
      return 1;
    case 2:
      return 4;
    case 3:
      return 7;
    case 4:
      return 10;
    default:
      throw new TypeError('Unknown quarter');
  }
}
