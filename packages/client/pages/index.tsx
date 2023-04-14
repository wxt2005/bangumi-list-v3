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
import useSWR from 'swr';
import styles from './index.module.css';

export default function OnAirPage(): JSX.Element {
  const {
    data: onairData,
    error: onairError,
    isLoading: onairIsLoading,
  } = useSWR('bangumi/onair', () => getOnair());
  const {
    data: siteData,
    error: siteError,
    isLoading: siteIsLoading,
  } = useSWR('bangumi/site', () => getSites());
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
    const items = onairData?.items || [];
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
    onairData,
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
    if (!siteData) return {};

    return {
      ...siteData,
      bangumi: {
        ...siteData.bangumi,
        urlTemplate: bangumiTemplates[bangumiDomain],
      },
    };
  }, [siteData, bangumiDomain]);

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

  let content = null;
  if (!!onairError || !!siteError) {
    content = <p className={styles.status}>获取数据失败，请稍后重试</p>;
  } else if (onairIsLoading || siteIsLoading) {
    content = <p className={styles.status}>加载中……</p>;
  } else {
    content = (
      <BangumiItemTable
        items={filteredItems}
        siteMeta={modifiedSiteMeta}
        emptyText={isInSearch ? '无结果' : '暂无'}
      />
    );
  }

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
        {content}
      </Container>
    </>
  );
}
