import React from 'react';
import styles from './BangumiItem.module.css';
import classNames from 'classnames';
import { Item, SiteType } from 'bangumi-list-v3-shared';
import getBroadcastTimeString from '../utils/getBroadcastTimeString';
import { useAppSelector } from '../app/hooks';
import { selectSiteEntities } from '../features/bangumi/siteSlice';
import { get } from 'lodash';
import { format, isSameQuarter } from 'date-fns';
import BangumiLinkItem from './BangumiLinkItem';
import FavIconEmpty from '../images/favorite-empty.svg';
import FavIconFull from '../images/favorite-full.svg';

interface Props {
  className?: string;
  item: Item;
  isArchive?: boolean;
  isWatching?: boolean;
  onWatchingClick?: (isWatching: boolean) => void;
}

export default function BangumiItem(props: Props): JSX.Element {
  const {
    className,
    item,
    isArchive = false,
    isWatching = false,
    onWatchingClick,
  } = props;
  const rootClassName = classNames(className, styles.root);
  const siteMeta = useAppSelector(selectSiteEntities);
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
      <li key={site.id}>
        <BangumiLinkItem site={site} />
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
    onWatchingClick && onWatchingClick(!isWatching);
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
            aria-label={isWatching ? '????????????' : '??????'}
            title={isWatching ? '????????????' : '??????'}
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
          <dt>??????</dt>
          <dd>{broadcastTimeString.jp || '??????'}</dd>
        </div>
        <div className={styles.cnTime}>
          <dt>??????</dt>
          <dd>{broadcastTimeString.cn || '??????'}</dd>
        </div>
        <div className={styles.start}>
          <dt>??????</dt>
          <dd>{beginString}</dd>
        </div>
        <div className={styles.info}>
          <dt>??????</dt>
          <dd>
            <ul>
              {item.officialSite ? (
                <li>
                  <a href={item.officialSite} rel="noopener" target="_blank">
                    ??????
                  </a>
                </li>
              ) : null}
              {infoSites}
            </ul>
          </dd>
        </div>
        <div className={styles.onair}>
          <dt>??????</dt>
          <dd>{onairSites.length ? <ul>{onairSites}</ul> : '??????'}</dd>
        </div>
        <div className={styles.resource}>
          <dt>??????</dt>
          <dd>{resourceSites.length ? <ul>{resourceSites}</ul> : '??????'}</dd>
        </div>
      </dl>
    </article>
  );
}
