export interface LoginResponse {
  token: string;
}

export interface UserUpdateRequest {
  oldPassword: string;
  newPassword: string;
}

export enum Status {
  INITIAL = 'INITIAL',
  PENDING = 'PENDING',
  FULFILED = 'FULFILED',
  REJECTED = 'REJECTED',
}

export enum Weekday {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FIRDAY = 5,
  SATURDAY = 6,
  ALL = -1,
}
