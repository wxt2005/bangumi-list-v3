import api from '../utils/api';
import {
  SeasonList,
  SiteType,
  SiteMeta,
  ItemList,
} from 'bangumi-list-v3-shared';

export async function getSeasonList(start = ''): Promise<SeasonList> {
  return await api.request<SeasonList>('GET', 'bangumi/season', {
    ...(start && { start }),
  });
}

export async function getSites(type?: SiteType): Promise<SiteMeta> {
  return await api.request<SiteMeta>('GET', 'bangumi/site', {
    type,
  });
}

export async function getArchive(season: string): Promise<ItemList> {
  return await api.request<ItemList>('GET', `bangumi/archive/${season}`);
}

export async function getOnair(): Promise<ItemList> {
  return await api.request<ItemList>('GET', `bangumi/onair`);
}
