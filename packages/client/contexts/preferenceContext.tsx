import { createContext, useContext, useReducer } from 'react';
import {
  VersionedCommonPreference,
  VersionedBangumiPreference,
  BangumiDomain,
} from 'bangumi-list-v3-shared';

export const PreferenceContext = createContext<PreferenceState | null>(null);
export const PreferenceDispatchContext =
  createContext<React.Dispatch<PreferenceAction> | null>(null);

export interface PreferenceState {
  common: {
    version: number;
    newOnly: boolean;
    watchingOnly: boolean;
    hoistWatching: boolean;
    bangumiDomain: BangumiDomain;
  };
  bangumi: {
    version: number;
    watching: string[];
  };
}

const initialState: PreferenceState = {
  common: {
    version: 0,
    newOnly: false,
    watchingOnly: false,
    hoistWatching: false,
    bangumiDomain: BangumiDomain.BANGUMI_TV,
  },
  bangumi: {
    version: 0,
    watching: [],
  },
};

export type PreferenceAction =
  | { type: 'SET_COMMON_PREFERENCE'; payload: VersionedCommonPreference }
  | { type: 'SET_BANGUMI_PREFERENCE'; payload: VersionedBangumiPreference }
  | { type: 'ADD_BANGUMI_WATCHING'; payload: string }
  | { type: 'DEL_BANGUMI_WATCHING'; payload: string };

function preferenceReducer(state: PreferenceState, action: PreferenceAction) {
  switch (action.type) {
    case 'SET_COMMON_PREFERENCE': {
      return {
        ...state,
        common: {
          ...state.common,
          ...action.payload,
          version: Date.now(),
        },
      };
    }
    case 'SET_BANGUMI_PREFERENCE': {
      return {
        ...state,
        bangumi: {
          ...state.bangumi,
          ...action.payload,
          version: Date.now(),
        },
      };
    }
    case 'ADD_BANGUMI_WATCHING': {
      return {
        ...state,
        bangumi: {
          ...state.bangumi,
          watching: [...state.bangumi.watching, action.payload],
          version: Date.now(),
        },
      };
    }
    case 'DEL_BANGUMI_WATCHING': {
      return {
        ...state,
        bangumi: {
          ...state.bangumi,
          watching: state.bangumi.watching.filter(
            (id) => id !== action.payload
          ),
          version: Date.now(),
        },
      };
    }
    default: {
      throw Error('Unknown action');
    }
  }
}

export function PreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [state, dispatch] = useReducer(preferenceReducer, initialState);

  return (
    <PreferenceContext.Provider value={state}>
      <PreferenceDispatchContext.Provider value={dispatch}>
        {children}
      </PreferenceDispatchContext.Provider>
    </PreferenceContext.Provider>
  );
}

export function usePreference(): PreferenceState {
  const context = useContext(PreferenceContext);
  if (!context) {
    throw new Error('preferenceContext should not be null');
  }
  return context;
}

export function usePreferenceDispatch(): React.Dispatch<PreferenceAction> {
  const dispatch = useContext(PreferenceDispatchContext);
  if (typeof dispatch !== 'function') {
    throw new Error('preferenceDispatch not be null');
  }
  return dispatch;
}
