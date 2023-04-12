import { Item } from 'bangumi-list-v3-shared';
import { Weekday } from '../types';
import { isSameQuarter } from 'date-fns';

export const getBroadcastDate = (item: Item): Date => {
  const { begin, broadcast } = item;
  if (broadcast) {
    return new Date(broadcast.split('/')[1]);
  }

  return new Date(begin);
};

export const newBangumiFilter = (item: Item): boolean => {
  return isSameQuarter(new Date(), new Date(item.begin));
};

export const watchingFilter =
  (watchingIds: string[]) =>
  (item: Item): boolean => {
    return !!item.id && watchingIds.includes(item.id);
  };

export const weekdayFilter =
  (currentTab: Weekday) =>
  (item: Item): boolean => {
    if (currentTab === Weekday.ALL) return true;
    const broadcastWeekday = getBroadcastDate(item).getDay();
    return currentTab === broadcastWeekday;
  };

export const searchFilter =
  (searchText: string) =>
  (item: Item): boolean => {
    searchText = searchText.toLowerCase();
    const itemTitles = [item.title];
    for (const titles of Object.values(item.titleTranslate || {})) {
      Array.prototype.push.apply(itemTitles, titles);
    }
    if (item.pinyinTitles) {
      Array.prototype.push.apply(itemTitles, item.pinyinTitles);
    }

    return itemTitles.some((text) => text.toLowerCase().includes(searchText));
  };

export const itemSortCompare = (first: Item, second: Item): number => {
  const firstBroadcastWeekday = getBroadcastDate(first);
  const secondBroadcastWeekday = getBroadcastDate(second);
  if (firstBroadcastWeekday.getHours() === secondBroadcastWeekday.getHours()) {
    if (
      firstBroadcastWeekday.getMinutes() === secondBroadcastWeekday.getMinutes()
    ) {
      return 0;
    }

    return firstBroadcastWeekday.getMinutes() <
      secondBroadcastWeekday.getMinutes()
      ? -1
      : 1;
  }
  return firstBroadcastWeekday.getHours() < secondBroadcastWeekday.getHours()
    ? -1
    : 1;
};

export const hoistWatchingItems = (
  items: Item[],
  watchingIds: string[]
): Item[] => {
  const watching: Item[] = [];
  const notWatching: Item[] = [];
  for (const item of items) {
    if (!item.id) continue;
    if (watchingIds.includes(item.id)) {
      watching.push(item);
    } else {
      notWatching.push(item);
    }
  }
  return [...watching, ...notWatching];
};
