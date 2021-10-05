import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import {
  BangumiPreference,
  VersionedBangumiPreference,
} from 'bangumi-list-v3-shared';
import { STORAGE_BANGUMI_PREFERENCE_NAME } from '../../constants/storage';
import {
  getBangumiPreference,
  updateBangumiPreference,
} from '../../models/preference';
import { Status } from '../../types';

export interface BangumiPreferenceState extends VersionedBangumiPreference {
  status: Status;
}

const initialState: BangumiPreferenceState = {
  status: Status.INITIAL,
  version: 0,
  watching: [],
};

export const saveBangumiPreferenceToStorage = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('preference/bangumi/save', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  try {
    localStorage.setItem(
      STORAGE_BANGUMI_PREFERENCE_NAME,
      JSON.stringify(state.bangumiPreference)
    );
  } catch (error) {
    console.error(error);
  }
});

export const readBangumiPreferenceFromStorage =
  createAsyncThunk<VersionedBangumiPreference | null>(
    'preference/bangumi/read',
    async () => {
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
  );

export const fetchBangumiPreference =
  createAsyncThunk<VersionedBangumiPreference>(
    'preference/bangumi/fetch',
    async () => {
      return await getBangumiPreference();
    }
  );

export const uploadBangumiPreference = createAsyncThunk<
  BangumiPreference,
  void,
  { state: RootState }
>('preference/bangumi/upload', async (param, thunkAPI) => {
  const state = thunkAPI.getState();
  const { version: _, ...newBangumiPreference } = state.bangumiPreference;
  return await updateBangumiPreference(newBangumiPreference);
});

export const bangumiPreferenceSlice = createSlice({
  name: 'preference/bangumi',
  initialState,
  reducers: {
    setBangumiPreference: (state, action: PayloadAction<BangumiPreference>) => {
      state.watching = action.payload.watching;
      state.version = Date.now();
    },
    addBangumiWatching: (state, action: PayloadAction<string>) => {
      state.watching.push(action.payload);
      state.version = Date.now();
    },
    removeBangumiWatching: (state, action: PayloadAction<string>) => {
      state.watching = state.watching.filter((id) => id !== action.payload);
      state.version = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readBangumiPreferenceFromStorage.pending, (state) => {
        state.status = Status.PENDING;
      })
      .addCase(readBangumiPreferenceFromStorage.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.watching = action.payload.watching;
        state.version = action.payload.version;
        state.status = Status.FULFILED;
      })
      .addCase(readBangumiPreferenceFromStorage.rejected, (state) => {
        state.status = Status.REJECTED;
      });

    builder
      .addCase(fetchBangumiPreference.pending, (state) => {
        state.status = Status.PENDING;
      })
      .addCase(fetchBangumiPreference.fulfilled, (state, action) => {
        state.watching = action.payload.watching;
        state.version = action.payload.version;
        state.status = Status.FULFILED;
      })
      .addCase(fetchBangumiPreference.rejected, (state) => {
        state.status = Status.REJECTED;
      });
  },
});

export const {
  setBangumiPreference,
  addBangumiWatching,
  removeBangumiWatching,
} = bangumiPreferenceSlice.actions;
export const selectBangumiPreferenceStatus = (state: RootState): Status =>
  state.bangumiPreference.status;
export const selectBangumiWatching = (state: RootState): string[] =>
  state.bangumiPreference.watching;

export default bangumiPreferenceSlice.reducer;
