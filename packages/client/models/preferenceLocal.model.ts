import type {
  VersionedCommonPreference,
  VersionedBangumiPreference,
  BangumiPreference,
  CommonPreference,
} from 'bangumi-list-v3-shared';
import {
  STORAGE_BANGUMI_PREFERENCE_NAME,
  STORAGE_COMMON_PREFERENCE_NAME,
} from '../constants/storage';

export async function getCommonPreferenceLocal(): Promise<VersionedCommonPreference | null> {
  try {
    const str = localStorage.getItem(STORAGE_COMMON_PREFERENCE_NAME);
    if (!str) {
      return null;
    }
    const obj: VersionedCommonPreference = JSON.parse(str);
    return obj;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateCommonPreferenceLocal(
  data: CommonPreference
): Promise<boolean> {
  try {
    localStorage.setItem(STORAGE_COMMON_PREFERENCE_NAME, JSON.stringify(data));
    return Promise.resolve(true);
  } catch (error) {
    console.error(error);
    return Promise.resolve(false);
  }
}

export async function getBangumiPreferenceLocal(): Promise<VersionedBangumiPreference | null> {
  try {
    const str = localStorage.getItem(STORAGE_BANGUMI_PREFERENCE_NAME);
    if (!str) {
      return null;
    }
    const obj: VersionedBangumiPreference = JSON.parse(str);
    return obj;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateBangumiPreferenceLocal(
  data: BangumiPreference
): Promise<boolean> {
  try {
    localStorage.setItem(STORAGE_BANGUMI_PREFERENCE_NAME, JSON.stringify(data));
    return Promise.resolve(true);
  } catch (error) {
    console.error(error);
    return Promise.resolve(false);
  }
}
