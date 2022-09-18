import React, { useEffect, useState, useMemo } from 'react';
import BaseContainer from '../base/BaseContainer';
import Top from '../Top';
import BangumiItemTable from '../BangumiItemTable';
import { Weekday, Status } from '../../types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchOnair,
  selectOnairItemEntities,
} from '../../features/bangumi/itemSlice';
import { selectCommonPreference } from '../../features/preference/commonPreferenceSlice';
import {
  selectBangumiWatching,
  selectBangumiPreferenceStatus,
} from '../../features/preference/bangumiPreferenceSlice';
import WeekdayTab from '../WeekdayTab';
import {
  newBangumiFilter,
  watchingFilter,
  weekdayFilter,
  searchFilter,
  itemSortCompare,
  hoistWatchingItems,
} from '../../utils/bangumiItemUtils';
import { useLocation, Link } from 'react-router-dom';
import styles from './OnAirPage.module.css';

export default function OnAirPage(): JSX.Element {
  const [currentTab, setCurrentTab] = useState<Weekday>(new Date().getDay());
  const [searchText, setSearchText] = useState<string>('');
  const [hoistWatchingIds, setHoistWatchingIds] = useState<string[] | null>(
    null
  );
  const dispatch = useAppDispatch();
  const location = useLocation();
  const items = useAppSelector(selectOnairItemEntities);
  const { newOnly, watchingOnly, hoistWatching } = useAppSelector(
    selectCommonPreference
  );
  const bangumiPreferenceStatus = useAppSelector(selectBangumiPreferenceStatus);
  const watchingIds = useAppSelector(selectBangumiWatching);
  const isInSearch = !!searchText;
  const filteredItems = useMemo(() => {
    if (!items.length) return [];
    let filteredItems = [];
    if (isInSearch) {
      filteredItems = items.filter(searchFilter(searchText));
    } else {
      filteredItems = items.filter(weekdayFilter(currentTab));
      if (watchingOnly) {
        filteredItems = filteredItems.filter(watchingFilter(watchingIds));
      } else if (newOnly) {
        filteredItems = filteredItems.filter(newBangumiFilter);
      }
    }
    filteredItems.sort(itemSortCompare);
    if (hoistWatching && hoistWatchingIds) {
      filteredItems = hoistWatchingItems(filteredItems, hoistWatchingIds);
    }
    return filteredItems;
  }, [
    items,
    isInSearch,
    searchText,
    currentTab,
    watchingIds,
    watchingOnly,
    newOnly,
    hoistWatching,
    hoistWatchingIds,
  ]);

  const handleTabClick = (tab: Weekday) => {
    setCurrentTab(tab);
  };
  const handleSearchInput = (text: string) => {
    setSearchText(text);
  };

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchOnair());
    }
  }, []);
  useEffect(() => {
    if (hoistWatching && watchingIds.length) {
      setHoistWatchingIds(watchingIds);
    }
  }, [currentTab, hoistWatching]);
  useEffect(() => {
    if (bangumiPreferenceStatus === Status.FULFILED) {
      setHoistWatchingIds(watchingIds);
    }
  }, [bangumiPreferenceStatus]);

  return (
    <main>
      <BaseContainer className={styles.root}>
        <Top onSearchInput={handleSearchInput} />
        <header className={styles.header}>
          <WeekdayTab
            disabled={isInSearch}
            activated={currentTab}
            onClick={handleTabClick}
          />
          <Link
            className={styles.settingBtn}
            to="/config"
            state={{ backgroundLocation: location }}
          >
            <span>设置</span>
          </Link>
        </header>
        <BangumiItemTable
          items={filteredItems}
          emptyText={isInSearch ? '无结果' : '暂无'}
        />
      </BaseContainer>
    </main>
  );
}
