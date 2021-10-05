import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { getSites } from '../../models/bangumi.model';
import type { SiteItem, SiteType, SiteMeta } from 'bangumi-list-v3-shared';
import { Status } from '../../types';

export interface BangumiSiteState {
  status: Status;
  idsByType: {
    [key in SiteType]?: string[];
  };
  entities: {
    [key: string]: SiteItem;
  };
}

const initialState: BangumiSiteState = {
  status: Status.INITIAL,
  idsByType: {},
  entities: {},
};

export const fetchAllSites = createAsyncThunk<SiteMeta>(
  'bangumi/site',
  async () => {
    return await getSites();
  }
);

export const bangumiSiteSlice = createSlice({
  name: 'bangumiSite',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSites.pending, (state) => {
        state.status = Status.PENDING;
      })
      .addCase(fetchAllSites.fulfilled, (state, action) => {
        const idsByType: BangumiSiteState['idsByType'] = {};
        const entities: BangumiSiteState['entities'] = {};
        for (const [siteName, site] of Object.entries(action.payload)) {
          idsByType[site.type] = idsByType[site.type] || [];
          idsByType[site.type]?.push(siteName);
          entities[siteName] = site;
        }
        state.idsByType = idsByType;
        state.entities = entities;
        state.status = Status.FULFILED;
      })
      .addCase(fetchAllSites.rejected, (state) => {
        state.status = Status.REJECTED;
      });
  },
});

export const selectSiteIdsByType = (
  state: RootState
): BangumiSiteState['idsByType'] => state.bangumiSite.idsByType;
export const selectSiteEntities = (
  state: RootState
): BangumiSiteState['entities'] => state.bangumiSite.entities;
export default bangumiSiteSlice.reducer;
