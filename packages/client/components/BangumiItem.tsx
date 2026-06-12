import React from 'react';
import classNames from 'classnames';
import type { Item, SiteMeta } from 'bangumi-list-v3-shared';
import { SiteType } from 'bangumi-list-v3-shared';
import getBroadcastTimeString from '../utils/getBroadcastTimeString';
import { get } from 'lodash';
import { format, isSameQuarter } from 'date-fns';
import BangumiLinkItem from './BangumiLinkItem';
import FavIconEmpty from '../images/favorite-empty.svg';
import FavIconFull from '../images/favorite-full.svg';
import styles from './BangumiItem.module.css';

interface Props {
  className?: string;
  item: Item;
  siteMeta?: SiteMeta;
  isArchive?: boolean;
  isWatching?: boolean;
  onWatchingClick?: () => void;
}

export default function BangumiItem(props: Props): JSX.Element {
  const {
    className,
    item,
    siteMeta = {},
    isArchive = false,
    isWatching = false,
    onWatchingClick,
  } = props;
  const rootClassName = classNames(className, styles.root);
  const broadcastTimeString = getBroadcastTimeString(item, siteMeta);
  const titleCN = get(item, 'titleTranslate.zh-Hans[0]', '');
  const nowDate = new Date();
  const beginDate = new Date(item.begin);
  const beginString = format(beginDate, 'yyyy-MM-dd');
  const isNew = isSameQuarter(nowDate, beginDate);
  const infoSites = [];
  const onairSites = [];
  const resourceSites = [];
  for (const site of item.sites) {
    if (!siteMeta[site.site]) continue;
    const node = (
      <li key={`${site.site}_${site.id}`}>
        <BangumiLinkItem site={site} siteMeta={siteMeta} />
      </li>
    );
    switch (siteMeta[site.site].type) {
      case SiteType.INFO:
        infoSites.push(node);
        break;
      case SiteType.RESOURCE:
        resourceSites.push(node);
        break;
      case SiteType.ONAIR:
        onairSites.push(node);
        break;
      default:
        continue;
    }
  }
  const handleWatchingClick = () => {
    if (onWatchingClick) {
      onWatchingClick();
    }
  };

  return (
    <article className={rootClassName}>
      <header className={styles.header}>
        <div className={styles.titleBox}>
          <h3 className={styles.title}>{titleCN || item.title}</h3>
          {titleCN ? (
            <span className={styles.subTitle}>{item.title}</span>
          ) : null}
          {!isArchive && isNew ? (
            <span className={styles.newMark}>new</span>
          ) : null}
        </div>
        {isArchive ? null : (
          <button
            type="button"
            className={styles.favButton}
            aria-label={isWatching ? '取消在看' : '在看'}
            title={isWatching ? '取消在看' : '在看'}
            onClick={handleWatchingClick}
          >
            {isWatching ? (
              <FavIconFull className={styles.favIcon} />
            ) : (
              <FavIconEmpty className={styles.favIcon} />
            )}
          </button>
        )}
      </header>
      <div className={styles.inner}>
        <div className={styles.datetime}>
          <div className={styles.sectionTitle}>时间:</div>
          <span className={styles.start}>{beginString} 起</span>
          <span>
            {broadcastTimeString.jp ? `每${broadcastTimeString.jp}` : '暂无'}
          </span>
        </div>
        <div className={styles.info}>
          <div className={styles.sectionTitle}>情报:</div>
          <ul>
            {item.officialSite ? (
              <li>
                <a href={item.officialSite} rel="noopener" target="_blank">
                  官网
                </a>
              </li>
            ) : null}
            {infoSites}
          </ul>
        </div>
        <div className={styles.onair}>
          <div className={styles.sectionTitle}>配信:</div>
          {onairSites.length ? <ul>{onairSites}</ul> : <div>暂无</div>}
        </div>
        <div className={styles.resource}>
          <div className={styles.sectionTitle}>下载:</div>
          {resourceSites.length ? <ul>{resourceSites}</ul> : <div>暂无</div>}
        </div>
      </div>
    </article>
  );
}
