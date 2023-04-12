import React, { useState, useMemo } from 'react';
import { GetServerSideProps } from 'next';
import Top from '../../components/common/Top';
import BangumiItemTable from '../../components/BangumiItemTable';
import { getArchive, getSites } from '../../models/bangumi.model';
import formatSeason from '../../utils/formatSeason';
import { searchFilter, itemSortCompare } from '../../utils/bangumiItemUtils';
import { usePreference } from '../../contexts/preferenceContext';
import type { Item, SiteMeta } from 'bangumi-list-v3-shared';
import { bangumiTemplates } from '../../constants/links';
import Container from '../../components/common/Container';
import Head from 'next/head';
import styles from './[season].module.css';

export default function ArchivePage({
  items = [],
  siteMeta = {},
  topTitle = '',
}: {
  items?: Item[];
  siteMeta?: SiteMeta;
  topTitle?: string;
}): JSX.Element | null {
  const [searchText, setSearchText] = useState('');
  const isInSearch = !!searchText;
  const filteredItems = useMemo(() => {
    const filteredItems = items.filter(searchFilter(searchText));
    filteredItems.sort(itemSortCompare);
    return filteredItems;
  }, [items, isInSearch, searchText]);
  const handleSearchInput = (text: string) => {
    setSearchText(text);
  };
  const {
    common: { bangumiDomain },
  } = usePreference();

  const modifiedSiteMeta = useMemo(() => {
    return {
      ...siteMeta,
      bangumi: {
        ...siteMeta.bangumi,
        urlTemplate: bangumiTemplates[bangumiDomain],
      },
    };
  }, [siteMeta, bangumiDomain]);

  const metaTitle = `${topTitle}番组 | 番组放送`;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
      </Head>
      <Container className={styles.root}>
        <Top title={topTitle} onSearchInput={handleSearchInput} />
        <BangumiItemTable
          items={filteredItems}
          siteMeta={modifiedSiteMeta}
          isArchive
          emptyText={isInSearch ? '无结果' : '暂无'}
        />
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async function (context) {
  const { season } = context.query;
  if (typeof season !== 'string') {
    return {
      props: {
        items: [],
        topTitle: '',
      },
    };
  }

  const [archiveData, siteMeta] = await Promise.all([
    getArchive(season),
    getSites(),
  ]);

  return {
    props: {
      items: archiveData.items,
      siteMeta,
      topTitle: formatSeason(season),
    },
  };
};
