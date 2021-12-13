import React, { useMemo } from 'react';
import styles from './Footer.module.css';

export default function Footer(): JSX.Element {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  return (
    <footer className={styles.root}>
      <p>© 2014 - {currentYear} 番组放送</p>
      <p>
        <a
          href="https://github.com/wxt2005/bangumi-list-v3"
          rel="noopener"
          target="_blank"
        >
          GitHub
        </a>
      </p>
    </footer>
  );
}
