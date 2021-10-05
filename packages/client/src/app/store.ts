import { configureStore } from '@reduxjs/toolkit';
import bangumiItem from '../features/bangumi/itemSlice';
import bangumiSeason from '../features/bangumi/seasonSlice';
import bangumiSite from '../features/bangumi/siteSlice';
import user from '../features/user/userSlice';
import commonPreference from '../features/preference/commonPreferenceSlice';
import bangumiPreference from '../features/preference/bangumiPreferenceSlice';

export const store = configureStore({
  reducer: {
    bangumiItem,
    bangumiSeason,
    bangumiSite,
    user,
    commonPreference,
    bangumiPreference,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
