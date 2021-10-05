import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { User } from 'bangumi-list-v3-shared';
import { getUser, login, logout, updateUser } from '../../models/user.model';

export interface UserState {
  isLogin: boolean;
  id: string | null;
  email: string | null;
}

const initialState: UserState = {
  isLogin: false,
  id: null,
  email: null,
};

export const doLogin = createAsyncThunk<
  void,
  { email: string; password: string; save: boolean }
>('user/login', async ({ email, password, save }) => {
  await login(email, password, save);
});

export const doLogout = createAsyncThunk<void>('user/logout', async () => {
  await logout();
});

export const fetchUserInfo = createAsyncThunk<User>('user/info', async () => {
  return await getUser();
});

export const updateUserInfo = createAsyncThunk<
  void,
  {
    oldPassword: string;
    newPassword: string;
  }
>('user/update', async ({ oldPassword, newPassword }) => {
  return await updateUser({ newPassword, oldPassword });
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser: (state) => {
      state.id = null;
      state.email = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.isLogin = true;
    });

    builder.addCase(doLogin.fulfilled, (state) => {
      state.isLogin = true;
    });

    builder.addCase(doLogout.fulfilled, (state) => {
      state.isLogin = false;
      state.id = null;
      state.email = null;
    });
  },
});

export const selectIsLogin = (state: RootState): boolean => state.user.isLogin;
export const selectUserEmail = (state: RootState): string =>
  state.user.email || '';

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
