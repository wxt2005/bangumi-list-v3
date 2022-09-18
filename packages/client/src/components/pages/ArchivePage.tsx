import React, { useEffect, useState, useMemo } from 'react';
import BaseContainer from '../base/BaseContainer';
import Top from '../Top';
import BangumiItemTable from '../BangumiItemTable';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchArchive,
  selectBangumiItemEntitiesBySeason,
} from '../../features/bangumi/itemSlice';
import formatSeason from '../../utils/formatSeason';
import { searchFilter, itemSortCompare } from '../../utils/bangumiItemUtils';
import styles from './ArchivePage.module.css';

export default function ArchivePage(): JSX.Element | null {
  const [searchText, setSearchText] = useState('');
  const dispatch = useAppDispatch();
  const { season = '' } = useParams();
  const items = useAppSelector((state) =>
    selectBangumiItemEntitiesBySeason(state, season)
  );
  const isInSearch = !!searchText;
  const filteredItems = useMemo(() => {
    const filteredItems = items.filter(searchFilter(searchText));
    filteredItems.sort(itemSortCompare);
    return filteredItems;
  }, [items, isInSearch, searchText]);
  const handleSearchInput = (text: string) => {
    setSearchText(text);
  };
  useEffect(() => {
    if (season && !items.length) {
      dispatch(fetchArchive({ season }));
    }
    return () => {
      setSearchText('');
    };
  }, [season]);

  return (
    <main role="main">
      <BaseContainer className={styles.root}>
        <Top title={formatSeason(season)} onSearchInput={handleSearchInput} />
        <BangumiItemTable
          items={filteredItems}
          isArchive
          emptyText={isInSearch ? '无结果' : '暂无'}
        />
      </BaseContainer>
    </main>
  );
}
