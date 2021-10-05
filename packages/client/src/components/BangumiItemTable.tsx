import React from 'react';
import BangumiItem from './BangumiItem';
import { Item } from 'bangumi-list-v3-shared';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectIsLogin } from '../features/user/userSlice';
import {
  selectBangumiWatching,
  addBangumiWatching,
  removeBangumiWatching,
  saveBangumiPreferenceToStorage,
  uploadBangumiPreference,
} from '../features/preference/bangumiPreferenceSlice';
import styles from './BangumiItemTable.module.css';

interface Props {
  items?: Item[];
  isArchive?: boolean;
  emptyText?: string;
}

export default function BangumiItemTable(props: Props): JSX.Element {
  const { items = [], isArchive = false, emptyText = '暂无' } = props;
  const dispatch = useAppDispatch();
  const isLogin = useAppSelector(selectIsLogin);
  const watching = useAppSelector(selectBangumiWatching);
  const saveWatching = () => {
    isLogin
      ? dispatch(uploadBangumiPreference())
      : dispatch(saveBangumiPreferenceToStorage());
  };
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
        isWatching={isWatching}
        onWatchingClick={(isWatching) => {
          const action =
            isWatching && id
              ? addBangumiWatching(id)
              : removeBangumiWatching(id);
          dispatch(action);
          saveWatching();
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
