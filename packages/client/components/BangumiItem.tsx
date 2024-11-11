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
    onWatchingClick && onWatchingClick();
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
      <dl className={styles.inner}>
        <div className={styles.jpTime}>
          <dt>日本</dt>
          <dd>{broadcastTimeString.jp || '暂无'}</dd>
        </div>
        <div className={styles.cnTime}>
          <dt>大陆</dt>
          <dd>{broadcastTimeString.cn || '暂无'}</dd>
        </div>
        <div className={styles.start}>
          <dt>开播</dt>
          <dd>{beginString}</dd>
        </div>
        <div className={styles.info}>
          <dt>信息</dt>
          <dd>
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
          </dd>
        </div>
        <div className={styles.onair}>
          <dt>配信</dt>
          <dd>{onairSites.length ? <ul>{onairSites}</ul> : '暂无'}</dd>
        </div>
        <div className={styles.resource}>
          <dt>下载</dt>
          <dd>{resourceSites.length ? <ul>{resourceSites}</ul> : '暂无'}</dd>
        </div>
      </dl>
    </article>
  );
}
