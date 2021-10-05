export default function formatSeason(season: string): string {
  const match = /^(\d{4})q(\d)$/.exec(season);
  if (!match) return '';
  let monthString = '';
  switch (match[2]) {
    case '1':
      monthString = '1';
      break;
    case '2':
      monthString = '4';
      break;
    case '3':
      monthString = '7';
      break;
    case '4':
      monthString = '10';
      break;
    default:
      return '';
  }
  return `${match[1]}年${monthString}月`;
}
