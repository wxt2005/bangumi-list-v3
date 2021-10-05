import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { SeasonList } from 'bangumi-list-v3-shared';
import { Status } from '../../types';
import { getSeasonList } from '../../models/bangumi.model';

export interface BangumiSeasonState {
  status: Status;
  errorMesssage: string | null;
  version: number;
  seasons: string[];
  current: string | null;
}

const initialState: BangumiSeasonState = {
  status: Status.INITIAL,
  errorMesssage: null,
  version: 0,
  seasons: [],
  current: null,
};

export const fetchSeasons = createAsyncThunk<SeasonList, { start?: string }>(
  'bangumi/season',
  async ({ start }) => {
    return await getSeasonList(start);
  }
);

export const bangumiSeasonSlice = createSlice({
  name: 'bangumi/season',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeasons.pending, (state) => {
        state.status = Status.PENDING;
      })
      .addCase(fetchSeasons.fulfilled, (state, action) => {
        state.seasons = action.payload.items;
        state.version = action.payload.version;
        state.status = Status.FULFILED;
      })
      .addCase(fetchSeasons.rejected, (state, action) => {
        state.status = Status.REJECTED;
        state.errorMesssage = action.error.message || 'UNKNOWN';
      });
  },
});

export const selectBangumiSeasons = (state: RootState): string[] =>
  state.bangumiSeason.seasons;
export const selectBangumiVersion = (state: RootState): number =>
  state.bangumiSeason.version;

export default bangumiSeasonSlice.reducer;
