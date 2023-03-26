import { LoginResponse, UserUpdateRequest } from '../types';
import { User } from 'bangumi-list-v3-shared';
import api from '../utils/api';

export async function signup(email: string, password: string): Promise<void> {
  return await api.request<void>('POST', 'user/signup', undefined, {
    email,
    password,
  });
}

export async function login(
  email: string,
  password: string,
  save = true
): Promise<void> {
  const { token } = await api.request<LoginResponse>(
    'POST',
    'user/login',
    undefined,
    {
      email,
      password,
    }
  );
  api.setCredential(token);
  api.saveCredential(!save);
}

export async function logout(): Promise<void> {
  try {
    await api.request<void>('POST', 'user/logout', undefined, undefined, true);
  } finally {
    api.removeCredential();
  }
}

export async function getUser(): Promise<User> {
  return await api.request<User>('GET', 'user/me', undefined, undefined, true);
}

export async function updateUser(newData: UserUpdateRequest): Promise<void> {
  return await api.request<void>(
    'PATCH',
    'user/me',
    undefined,
    {
      ...newData,
    },
    true
  );
}
