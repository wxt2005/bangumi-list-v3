import { createContext, useContext, useReducer } from 'react';

export const UserContext = createContext<UserState | null>(null);
export const UserDispatchContext =
  createContext<React.Dispatch<UserAction> | null>(null);

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

export type UserAction =
  | { type: 'LOGIN'; id: string; email: string }
  | { type: 'LOGOUT' };

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'LOGIN': {
      return {
        ...state,
        isLogin: true,
        id: action.id,
        email: action.email,
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        isLogin: false,
        id: null,
        email: null,
      };
    }
    default: {
      throw Error('Unknown action');
    }
  }
}

export function UserProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export function useUser(): UserState {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw Error('userContext should not be null');
  }
  return userContext;
}

export function useUserDispatch(): React.Dispatch<UserAction> {
  const dispatch = useContext(UserDispatchContext);
  if (typeof dispatch !== 'function') {
    throw Error('userDispatch should be a function');
  }
  return dispatch;
}
