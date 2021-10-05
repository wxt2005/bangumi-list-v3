import React, { FormEventHandler, useState, useEffect } from 'react';
import BaseModal from '../base/BaseModal';
import { useNavigate } from 'react-router-dom';
import { BangumiDomain } from 'bangumi-list-v3-shared';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  setCommonPreference,
  saveCommonPreferenceToStorage,
  uploadCommonPreference,
  selectCommonPreference,
} from '../../features/preference/commonPreferenceSlice';
import { selectIsLogin } from '../../features/user/userSlice';
import styles from './ConfigModal.module.css';

const bangumiDomainOptions = [
  BangumiDomain.BANGUMI_TV,
  BangumiDomain.BGM_TV,
  BangumiDomain.CHII_IN,
];

export default function ConfigModal(): JSX.Element | null {
  const [newOnly, setNewOnly] = useState<boolean>(false);
  const [watchingOnly, setWatchingOnly] = useState<boolean>(false);
  const [hoistWatching, setHoistWatching] = useState<boolean>(false);
  const [bangumiDomain, setBangumiDomain] = useState<BangumiDomain>(
    BangumiDomain.BANGUMI_TV
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleClose = () => {
    navigate(-1);
  };
  const storePreference = useAppSelector(selectCommonPreference);
  const isLogin = useAppSelector(selectIsLogin);
  useEffect(() => {
    setNewOnly(storePreference.newOnly);
    setWatchingOnly(storePreference.watchingOnly);
    setHoistWatching(storePreference.hoistWatching);
    setBangumiDomain(storePreference.bangumiDomain);
  }, [storePreference]);

  const handleNewOnlyChange: React.FormEventHandler<HTMLInputElement> = (e) => {
    setNewOnly(e.currentTarget.checked);
  };
  const handleWatchingOnlyChange: React.FormEventHandler<HTMLInputElement> = (
    e
  ) => {
    setWatchingOnly(e.currentTarget.checked);
  };
  const handleHoistWatchingChange: React.FormEventHandler<HTMLInputElement> = (
    e
  ) => {
    setHoistWatching(e.currentTarget.checked);
  };
  const handleBangumiDomainChange: FormEventHandler<HTMLSelectElement> = (
    e
  ) => {
    setBangumiDomain(e.currentTarget.value as BangumiDomain);
  };
  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const newPreference = {
      newOnly,
      watchingOnly,
      hoistWatching,
      bangumiDomain,
    };

    dispatch(setCommonPreference(newPreference));
    if (isLogin) {
      dispatch(uploadCommonPreference());
    } else {
      dispatch(saveCommonPreferenceToStorage());
    }
    handleClose();
  };

  return (
    <BaseModal title="设置" isVisible showClose onClose={handleClose}>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="newOnly">只显示新番</label>
          <input
            id="newOnly"
            type="checkbox"
            checked={newOnly}
            onChange={handleNewOnlyChange}
          />
        </div>
        <div>
          <label htmlFor="watchingOnly">只显示在看</label>
          <input
            id="watchingOnly"
            type="checkbox"
            checked={watchingOnly}
            onChange={handleWatchingOnlyChange}
          />
        </div>
        <div>
          <label htmlFor="hoistWatching">置顶在看</label>
          <input
            id="hoistWatching"
            type="checkbox"
            checked={hoistWatching}
            onChange={handleHoistWatchingChange}
          />
        </div>
        <div>
          <label htmlFor="bangumiDomain">Bangumi域名</label>
          <select
            id="bangumiDomain"
            value={bangumiDomain}
            onChange={handleBangumiDomainChange}
          >
            {bangumiDomainOptions.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={styles.confirmButton}>
          确定
        </button>
      </form>
    </BaseModal>
  );
}
