import type { GetServerSideProps } from 'next';
import type { SiteMeta, Item } from 'bangumi-list-v3-shared';
import type { Weekday } from '../types';
import React, { useEffect, useState, useMemo } from 'react';
import Top from '../components/common/Top';
import BangumiItemTable from '../components/BangumiItemTable';
import WeekdayTab from '../components/WeekdayTab';
import {
  newBangumiFilter,
  watchingFilter,
  weekdayFilter,
  searchFilter,
  itemSortCompare,
  hoistWatchingItems,
} from '../utils/bangumiItemUtils';
import { usePreference } from '../contexts/preferenceContext';
import Link from 'next/link';
import { getOnair, getSites } from '../models/bangumi.model';
import { bangumiTemplates } from '../constants/links';
import Container from '../components/common/Container';
import Head from 'next/head';
import styles from './index.module.css';

export default function OnAirPage(): JSX.Element {
  const [items, setItems] = useState<Item[]>([]);
  const [siteMeta, setSiteMeta] = useState<SiteMeta>({});
  const [currentTab, setCurrentTab] = useState<Weekday>(new Date().getDay());
  const [searchText, setSearchText] = useState<string>('');
  const {
    common: { newOnly, watchingOnly, hoistWatching, bangumiDomain },
    bangumi: { watching },
  } = usePreference();
  const [hoistWatchingIds, setHoistWatchingIds] = useState<string[] | null>(
    null
  );
  const isInSearch = !!searchText;
  const filteredItems = useMemo(() => {
    if (!items.length) return [];
    let filteredItems = [];
    if (isInSearch) {
      filteredItems = items.filter(searchFilter(searchText));
    } else {
      filteredItems = items.filter(weekdayFilter(currentTab));
      if (watchingOnly) {
        filteredItems = filteredItems.filter(watchingFilter(watching));
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
    watching,
    watchingOnly,
    newOnly,
    hoistWatching,
    hoistWatchingIds,
  ]);
  const modifiedSiteMeta = useMemo(() => {
    return {
      ...siteMeta,
      bangumi: {
        ...siteMeta.bangumi,
        urlTemplate: bangumiTemplates[bangumiDomain],
      },
    };
  }, [siteMeta, bangumiDomain]);
  useEffect(() => {
    (async () => {
      const [onairData, siteMeta] = await Promise.all([getOnair(), getSites()]);
      setItems(onairData.items);
      setSiteMeta(siteMeta);
    })();
  }, []);

  const handleTabClick = (tab: Weekday) => {
    setCurrentTab(tab);
  };
  const handleSearchInput = (text: string) => {
    setSearchText(text);
  };

  useEffect(() => {
    if (hoistWatching) {
      setHoistWatchingIds(watching);
    } else {
      setHoistWatchingIds([]);
    }
  }, [currentTab, hoistWatching]);

  return (
    <>
      <Head>
        <title>每日放送 | 番组放送</title>
      </Head>
      <Container className={styles.root}>
        <Top onSearchInput={handleSearchInput} />
        <header className={styles.header}>
          <WeekdayTab
            disabled={isInSearch}
            activated={currentTab}
            onClick={handleTabClick}
          />
          <Link className={styles.settingBtn} href="/config">
            <span>设置</span>
          </Link>
        </header>
        <BangumiItemTable
          items={filteredItems}
          siteMeta={modifiedSiteMeta}
          emptyText={isInSearch ? '无结果' : '暂无'}
        />
      </Container>
    </>
  );
}
