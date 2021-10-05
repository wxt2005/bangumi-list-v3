import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import {
  CommonPreference,
  VersionedCommonPreference,
  BangumiDomain,
} from 'bangumi-list-v3-shared';
import { STORAGE_COMMON_PREFERENCE_NAME } from '../../constants/storage';
import {
  getCommonPreference,
  updateCommonPreference,
} from '../../models/preference';
import { Status } from '../../types';

export interface CommonPreferenceState extends VersionedCommonPreference {
  status: Status;
}

const initialState: CommonPreferenceState = {
  status: Status.INITIAL,
  version: 0,
  newOnly: false,
  watchingOnly: false,
  hoistWatching: false,
  bangumiDomain: BangumiDomain.BANGUMI_TV,
};

export const saveCommonPreferenceToStorage = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('preference/common/save', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  try {
    localStorage.setItem(
      STORAGE_COMMON_PREFERENCE_NAME,
      JSON.stringify(state.commonPreference)
    );
  } catch (error) {
    console.error(error);
  }
});

export const readCommonPreferenceFromStorage =
  createAsyncThunk<VersionedCommonPreference | null>(
    'preference/common/read',
    async () => {
      try {
        const str = localStorage.getItem(STORAGE_COMMON_PREFERENCE_NAME);
        if (!str) {
          return null;
        }
        const obj: VersionedCommonPreference = JSON.parse(str);
        return { ...initialState, ...obj };
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  );

export const fetchCommonPreference =
  createAsyncThunk<VersionedCommonPreference>(
    'preference/common/fetch',
    async () => {
      return await getCommonPreference();
    }
  );

export const uploadCommonPreference = createAsyncThunk<
  CommonPreference,
  void,
  { state: RootState }
>('preference/common/upload', async (param, thunkAPI) => {
  const state = thunkAPI.getState();
  const { version: _, ...newCommonPreference } = state.commonPreference;
  return await updateCommonPreference(newCommonPreference);
});

export const commonPreferenceSlice = createSlice({
  name: 'preference/common',
  initialState,
  reducers: {
    setCommonPreference: (state, action: PayloadAction<CommonPreference>) => {
      state.newOnly = action.payload.newOnly;
      state.watchingOnly = action.payload.watchingOnly;
      state.hoistWatching = action.payload.hoistWatching;
      state.bangumiDomain = action.payload.bangumiDomain;
      state.version = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readCommonPreferenceFromStorage.pending, (state) => {
        state.status = Status.PENDING;
      })
      .addCase(readCommonPreferenceFromStorage.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.newOnly = action.payload.newOnly;
        state.watchingOnly = action.payload.watchingOnly;
        state.hoistWatching = action.payload.hoistWatching;
        state.bangumiDomain = action.payload.bangumiDomain;
        state.version = action.payload.version;
        state.status = Status.FULFILED;
      })
      .addCase(readCommonPreferenceFromStorage.rejected, (state) => {
        state.status = Status.REJECTED;
      });

    builder
      .addCase(fetchCommonPreference.pending, (state) => {
        state.status = Status.PENDING;
      })
      .addCase(fetchCommonPreference.fulfilled, (state, action) => {
        state.newOnly = action.payload.newOnly;
        state.watchingOnly = action.payload.watchingOnly;
        state.hoistWatching = action.payload.hoistWatching;
        state.bangumiDomain = action.payload.bangumiDomain;
        state.version = action.payload.version;
      })
      .addCase(fetchCommonPreference.rejected, (state) => {
        state.status = Status.REJECTED;
      });
  },
});

export const { setCommonPreference } = commonPreferenceSlice.actions;
export const selectCommonPreference = (state: RootState): CommonPreference =>
  state.commonPreference;

export default commonPreferenceSlice.reducer;
