import React from 'react';
import SearchInput from './common/SearchInput';
import styles from './Top.module.css';
interface Props {
  title?: string;
  onSearchInput?: (text: string) => void;
}

export default function Top(props: Props): JSX.Element {
  const { title = '每日放送', onSearchInput } = props;
  const handleSearchInput = (value: string) => {
    onSearchInput && onSearchInput(value);
  };

  return (
    <div className={styles.root}>
      <h2 className={styles.heading}>{title}</h2>
      <SearchInput
        onInput={handleSearchInput}
        className={styles.searchForm}
        placeholder="检索本季番组"
      />
    </div>
  );
}
