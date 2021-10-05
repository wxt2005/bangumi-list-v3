import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { Item } from 'bangumi-list-v3-shared';
import { getArchive, getOnair } from '../../models/bangumi.model';
import { get } from 'lodash';
import { Status } from '../../types';

export interface BangumiItemState {
  fetchOnairStatus: Status;
  idsBySeason: {
    [key: string]: string[];
  };
  onAirIds: string[];
  entities: {
    [key: string]: Item;
  };
}

const initialState: BangumiItemState = {
  fetchOnairStatus: Status.INITIAL,
  idsBySeason: {},
  onAirIds: [],
  entities: {},
};

export const fetchArchive = createAsyncThunk<Item[], { season: string }>(
  'bangumi/archive',
  async ({ season }) => {
    return await (
      await getArchive(season)
    ).items;
  }
);

export const fetchOnair = createAsyncThunk<Item[]>(
  'bangumi/onair',
  async () => {
    return await (
      await getOnair()
    ).items;
  }
);

export const bangumiItemSlice = createSlice({
  name: 'bangumiItem',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchArchive.fulfilled, (state, action) => {
      const items = action.payload;
      const season = action.meta.arg.season;
      const ids = [];
      const entities: { [key: string]: Item } = {};
      for (const item of items) {
        if (!item.id) continue;
        ids.push(item.id);
        addDefaultResource(item);
        entities[item.id] = item;
      }
      state.idsBySeason[season] = ids;
      state.entities = {
        ...state.entities,
        ...entities,
      };
    });

    builder
      .addCase(fetchOnair.pending, (state) => {
        state.fetchOnairStatus = Status.PENDING;
      })
      .addCase(fetchOnair.fulfilled, (state, action) => {
        const items = action.payload;
        const ids = [];
        const entities: { [key: string]: Item } = {};
        for (const item of items) {
          if (!item.id) continue;
          ids.push(item.id);
          addDefaultResource(item);
          entities[item.id] = item;
        }
        state.onAirIds = ids;
        state.entities = {
          ...state.entities,
          ...entities,
        };
        state.fetchOnairStatus = Status.FULFILED;
      })
      .addCase(fetchOnair.rejected, (state) => {
        state.fetchOnairStatus = Status.REJECTED;
      });
  },
});

function addDefaultResource(item: Item) {
  if (item.sites.find((site) => site.site === 'dmhy')) return;
  item.sites.push({
    site: 'dmhy',
    id: get(item, 'titleTranslate.zh-Hans[0]', item.title),
  });
}

export const selectItemIdsBySeason = (
  state: RootState
): BangumiItemState['idsBySeason'] => state.bangumiItem.idsBySeason;
export const selectBangumiItemEntities = (
  state: RootState
): BangumiItemState['entities'] => state.bangumiItem.entities;
export const selectBangumiItemEntitiesBySeason = (
  state: RootState,
  season: string
): Item[] => {
  if (!season) return [];
  const ids = state.bangumiItem.idsBySeason[season];
  if (!ids) return [];
  const items: Item[] = [];
  for (const id of ids) {
    if (!state.bangumiItem.entities[id]) continue;
    items.push(state.bangumiItem.entities[id]);
  }
  return items;
};
export const selectOnairItemEntities = (state: RootState): Item[] => {
  const ids = state.bangumiItem.onAirIds;
  if (!ids) return [];
  const items: Item[] = [];
  for (const id of ids) {
    if (!state.bangumiItem.entities[id]) continue;
    items.push(state.bangumiItem.entities[id]);
  }
  return items;
};
export default bangumiItemSlice.reducer;
