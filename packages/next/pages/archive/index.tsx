import React from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { getSeasonList } from '../../models/bangumi.model';
import quarterToMonth from '../../utils/quarterToMonth';
import Container from '../../components/common/Container';
import Head from 'next/head';
import styles from './index.module.css';

export default function ArchiveModal({
  seasons,
}: {
  seasons: string[];
}): JSX.Element {
  const yearOptions: string[] = [];
  const yearQuarterOptions: { [key: string]: string[] } = {};

  for (const season of seasons) {
    const match = /^(\d{4})q(\d)$/.exec(season);
    if (!match) continue;
    const [, year, quarter] = match;
    if (!yearQuarterOptions[year]) {
      yearOptions.unshift(year); // revese years
      yearQuarterOptions[year] = [];
    }
    yearQuarterOptions[year].push(quarter);
  }

  return (
    <>
      <Head>
        <title>历史数据 | 番组放送</title>
      </Head>
      <Container className={styles.root}>
        <h2 className={styles.heading}>历史数据</h2>
        <div className={styles.sectionBox}>
          {yearOptions.map((year) => (
            <section key={year} className={styles.section}>
              <h3 className={styles.sectionHeader}>{year}年</h3>
              <ol className={styles.sectionList}>
                {yearQuarterOptions[year].map((quarter) => (
                  <li key={`${year}_${quarter}`}>
                    <Link
                      href={`/archive/${year}q${quarter}`}
                    >{`${year}年${quarterToMonth(
                      parseInt(quarter, 10)
                    )}月`}</Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { items } = await getSeasonList();

  return {
    props: {
      seasons: items,
    },
  };
};
