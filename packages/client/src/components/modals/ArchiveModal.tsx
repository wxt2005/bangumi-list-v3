import React, { useState, useEffect } from 'react';
import BaseModal from '../base/BaseModal';
import {
  fetchSeasons,
  selectBangumiSeasons,
} from '../../features/bangumi/seasonSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import quarterToMonth from '../../utils/quarterToMonth';
import styles from './ArchiveModal.module.css';

export default function ArchiveModal(): JSX.Element {
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [yearQuarterOptions, setYearQuarterOptions] = useState<{
    [key: string]: string[];
  }>({});
  const [yearValue, setYearValue] = useState('');
  const [quarterValue, setQuarterValue] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const seasons = useAppSelector(selectBangumiSeasons);
  useEffect(() => {
    if (!seasons.length) {
      dispatch(fetchSeasons({}));
    }
  }, [seasons]);
  useEffect(() => {
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

    setYearOptions(yearOptions);
    setYearQuarterOptions(yearQuarterOptions);
    if (yearOptions.length) {
      const firstYear = yearOptions[0];
      setYearValue(firstYear);
      if (
        yearQuarterOptions[firstYear] &&
        yearQuarterOptions[firstYear].length
      ) {
        setQuarterValue(yearQuarterOptions[firstYear][0]);
      }
    }
  }, [seasons]);
  const handleClose = () => {
    navigate(-1);
  };
  const handleYearChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const year = e.currentTarget.value;
    setYearValue(year);
    const firstSeasonInYear = yearQuarterOptions[year][0];
    setQuarterValue(firstSeasonInYear);
  };
  const handleQuarterChange: React.ChangeEventHandler<HTMLSelectElement> = (
    e
  ) => {
    const quarter = e.currentTarget.value;
    setQuarterValue(quarter);
  };
  const handleConfirm: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!yearValue || !quarterValue) return;
    const season = `${yearValue}q${quarterValue}`;
    navigate(`/archive/${season}`);
  };

  return (
    <BaseModal id="archive" title="历史数据" isVisible onClose={handleClose}>
      <form onSubmit={handleConfirm} className={styles.form}>
        <div className={styles.group}>
          <label htmlFor="year" className={styles.label}>
            年份
          </label>
          <select
            id="year"
            className={styles.select}
            value={yearValue}
            onChange={handleYearChange}
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>{`${year}年`}</option>
            ))}
          </select>
        </div>
        <div className={styles.group}>
          <label htmlFor="quarter" className={styles.label}>
            季度
          </label>
          <select
            id="quarter"
            className={styles.select}
            value={quarterValue}
            onChange={handleQuarterChange}
          >
            {yearQuarterOptions[yearValue]
              ? yearQuarterOptions[yearValue].map((quarter) => {
                  const text = `${quarterToMonth(parseInt(quarter, 10))}月`;
                  return (
                    <option key={`${yearValue}q${quarter}`} value={quarter}>
                      {text}
                    </option>
                  );
                })
              : null}
          </select>
        </div>
        <button type="submit" className={styles.confirmButton}>
          查看
        </button>
      </form>
    </BaseModal>
  );
}
