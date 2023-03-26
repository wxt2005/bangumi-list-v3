import React, { useEffect, useRef } from 'react';
import BangumiItem from './BangumiItem';
import type { Item, SiteMeta } from 'bangumi-list-v3-shared';
import { useUser } from '../contexts/userContext';
import {
  usePreference,
  usePreferenceDispatch,
} from '../contexts/preferenceContext';
import { updateBangumiPreference } from '../models/preference.model';
import { updateBangumiPreferenceLocal } from '../models/preferenceLocal.model';
import styles from './BangumiItemTable.module.css';

interface Props {
  items?: Item[];
  siteMeta?: SiteMeta;
  isArchive?: boolean;
  emptyText?: string;
}

export default function BangumiItemTable(props: Props): JSX.Element {
  const {
    items = [],
    siteMeta = {},
    isArchive = false,
    emptyText = '暂无',
  } = props;
  const {
    bangumi: { watching, version },
    bangumi,
  } = usePreference();
  const { isLogin } = useUser();
  const lastBangumiPreferenceVersion = useRef<number>(version);
  const preferenceDispatch = usePreferenceDispatch();

  useEffect(() => {
    if (version > lastBangumiPreferenceVersion.current) {
      if (isLogin) {
        updateBangumiPreference(bangumi);
      } else {
        updateBangumiPreferenceLocal(bangumi);
      }
      lastBangumiPreferenceVersion.current = version;
    }
  }, [version]);

  const itemNodes = [];
  for (const item of items) {
    const id = item.id || '';
    const isWatching = watching.includes(id);
    itemNodes.push(
      <BangumiItem
        key={item.id}
        className={styles.item}
        isArchive={isArchive}
        item={item}
        siteMeta={siteMeta}
        isWatching={isWatching}
        onWatchingClick={() => {
          if (isWatching) {
            preferenceDispatch({
              type: 'DEL_BANGUMI_WATCHING',
              payload: id,
            });
          } else {
            preferenceDispatch({
              type: 'ADD_BANGUMI_WATCHING',
              payload: id,
            });
          }
        }}
      />
    );
  }

  return (
    <div className={styles.content}>
      {itemNodes.length ? (
        itemNodes
      ) : (
        <div className={styles.empty}>
          <span>{emptyText}</span>
        </div>
      )}
    </div>
  );
}
