import { format } from 'date-fns';
import zhCN from 'date-fns/locale/zh-CN';
import { Item, SiteMeta, SiteType } from 'bangumi-list-v3-shared';

function broadcastToTimeString(broadcast?: string, begin?: string): string {
  let time = '';
  if (broadcast) {
    time = broadcast.split('/')[1];
  } else if (begin) {
    time = begin;
  }
  if (!time) return '';
  return format(new Date(time), 'eee HH:mm', {
    locale: zhCN,
  });
}

export default function getBroadcastTimeString(
  item: Item,
  siteMeta: SiteMeta
): { jp: string; cn: string } {
  const { sites } = item;
  const jpString = broadcastToTimeString(item.broadcast, item.begin);
  let cnString = '';
  for (const site of sites) {
    const { site: siteKey } = site;
    if (!siteMeta[siteKey]) continue;
    const { type, regions = [] } = siteMeta[siteKey];
    if (type === SiteType.ONAIR && regions.includes('CN')) {
      cnString = broadcastToTimeString(site.broadcast, item.begin);
      if (cnString) {
        break;
      }
    }
  }
  return {
    jp: jpString,
    cn: cnString,
  };
}
