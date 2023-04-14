import { AxiosError } from 'axios';
import { useEffect } from 'react';
import api from '../utils/api';
import { getUser } from '../models/user.model';
import {
  getCommonPreference,
  getBangumiPreference,
} from '../models/preference.model';
import {
  getCommonPreferenceLocal,
  getBangumiPreferenceLocal,
} from '../models/preferenceLocal.model';
import { useUserDispatch } from '../contexts/userContext';
import { usePreferenceDispatch } from '../contexts/preferenceContext';
import type {
  VersionedBangumiPreference,
  VersionedCommonPreference,
} from 'bangumi-list-v3-shared';

export default function Core({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const userDispatch = useUserDispatch();
  const preferenceDispatch = usePreferenceDispatch();

  useEffect(() => {
    (async () => {
      let commonPreference: VersionedCommonPreference | null = null;
      let bangumiPreference: VersionedBangumiPreference | null = null;

      if (api.hasCredential()) {
        try {
          const { id, email } = await getUser();
          userDispatch({ type: 'LOGIN', id, email });
          commonPreference = await getCommonPreference();
          bangumiPreference = await getBangumiPreference();
        } catch (error) {
          if (error instanceof AxiosError && error.response?.status === 401) {
            api.removeCredential();
          } else {
            console.error(error);
          }
        }
      } else {
        try {
          commonPreference = await getCommonPreferenceLocal();
          bangumiPreference = await getBangumiPreferenceLocal();
        } catch (error) {
          console.error(error);
        }
      }

      if (commonPreference) {
        preferenceDispatch({
          type: 'SET_COMMON_PREFERENCE',
          payload: commonPreference,
        });
      }
      if (bangumiPreference) {
        preferenceDispatch({
          type: 'SET_BANGUMI_PREFERENCE',
          payload: bangumiPreference,
        });
      }
    })();
  }, []);

  return <> {children} </>;
}
