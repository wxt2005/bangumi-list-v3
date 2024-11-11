import React, { FormEventHandler, useState, useEffect } from 'react';
import { BangumiDomain, MikanDomain } from 'bangumi-list-v3-shared';
import {
  usePreference,
  usePreferenceDispatch,
} from '../../contexts/preferenceContext';
import { useUser } from '../../contexts/userContext';
import { updateCommonPreference } from '../../models/preference.model';
import { updateCommonPreferenceLocal } from '../../models/preferenceLocal.model';
import { useRouter } from 'next/router';
import Container from '../../components/common/Container';
import Head from 'next/head';
import styles from './index.module.css';

const bangumiDomainOptions = [
  BangumiDomain.BANGUMI_TV,
  BangumiDomain.BGM_TV,
  BangumiDomain.CHII_IN,
];

const mikanDomainOptions = [MikanDomain.MIKANANI_ME, MikanDomain.MIKANANI_TV];

export default function ConfigPage(): JSX.Element | null {
  const [newOnly, setNewOnly] = useState<boolean>(false);
  const [watchingOnly, setWatchingOnly] = useState<boolean>(false);
  const [hoistWatching, setHoistWatching] = useState<boolean>(false);
  const [bangumiDomain, setBangumiDomain] = useState<BangumiDomain>(
    BangumiDomain.BANGUMI_TV
  );
  const [mikanDomain, setMikanDomain] = useState<MikanDomain>(
    MikanDomain.MIKANANI_ME
  );
  const preferenceDispatch = usePreferenceDispatch();
  const { common: commonPreference } = usePreference();
  const { isLogin } = useUser();
  const router = useRouter();
  useEffect(() => {
    setNewOnly(commonPreference.newOnly);
    setWatchingOnly(commonPreference.watchingOnly);
    setHoistWatching(commonPreference.hoistWatching);
    setBangumiDomain(commonPreference.bangumiDomain);
    setMikanDomain(commonPreference.mikanDomain);
  }, [commonPreference]);

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
  const handleMikanDomainChange: FormEventHandler<HTMLSelectElement> = (e) => {
    setMikanDomain(e.currentTarget.value as MikanDomain);
  };
  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const newPreference = {
      newOnly,
      watchingOnly,
      hoistWatching,
      bangumiDomain,
      mikanDomain,
      version: Date.now(),
    };

    preferenceDispatch({
      type: 'SET_COMMON_PREFERENCE',
      payload: newPreference,
    });

    router.push('/');
    if (isLogin) {
      updateCommonPreference(newPreference);
    } else {
      updateCommonPreferenceLocal(newPreference);
    }
  };

  return (
    <>
      <Head>
        <title>设置 | 番组放送</title>
      </Head>
      <Container className={styles.root}>
        <h2 className={styles.heading}>设置</h2>
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
          <div>
            <label htmlFor="mikanDomain">Bangumi域名</label>
            <select
              id="mikanDomain"
              value={mikanDomain}
              onChange={handleMikanDomainChange}
            >
              {mikanDomainOptions.map((domain) => (
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
      </Container>
    </>
  );
}
