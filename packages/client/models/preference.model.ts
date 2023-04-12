import api from '../utils/api';
import {
  VersionedCommonPreference,
  VersionedBangumiPreference,
  BangumiPreference,
  CommonPreference,
} from 'bangumi-list-v3-shared';

export async function getCommonPreference(): Promise<VersionedCommonPreference> {
  return await api.request<VersionedCommonPreference>(
    'GET',
    '/preference/common',
    undefined,
    undefined,
    true
  );
}

export async function updateCommonPreference(
  newData: Partial<CommonPreference>
): Promise<VersionedCommonPreference> {
  return await api.request<VersionedCommonPreference>(
    'PATCH',
    'preference/common',
    undefined,
    {
      ...newData,
    },
    true
  );
}

export async function getBangumiPreference(): Promise<VersionedBangumiPreference> {
  return await api.request<VersionedBangumiPreference>(
    'GET',
    'preference/bangumi',
    undefined,
    undefined,
    true
  );
}

export async function updateBangumiPreference(
  newData: Partial<BangumiPreference>
): Promise<VersionedBangumiPreference> {
  return await api.request<VersionedBangumiPreference>(
    'PATCH',
    'preference/bangumi',
    undefined,
    {
      ...newData,
    },
    true
  );
}
