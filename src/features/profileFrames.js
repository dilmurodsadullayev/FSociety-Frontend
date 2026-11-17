
// src/features/profileFrames.js
// FSociety — Profile Frame Shop state and async actions.

import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import ProfileFrameService from "../services/profileFrames";
import { setCoinBalance } from "./coins";

const initialState = {
  shop: {
    items: [], count: 0, next: null, previous: null,
    params: { page: 1 }, loading: false, loaded: false,
    error: null, requestId: null,
  },
  inventory: {
    items: [], count: 0, next: null, previous: null,
    page: 1, loading: false, loaded: false,
    error: null, requestId: null,
  },
  detail: {
    data: null, frameId: null, loading: false,
    error: null, requestId: null,
  },
  stats: {
    data: null, loading: false, loaded: false,
    error: null, requestId: null,
  },
  mutation: {
    type: null, loading: false, error: null, lastResult: null,
  },
};

const getErrorMessage = (error, fallback) => {
  const body = error?.response?.data;
  if (typeof body === "string" && body.trim()) return body;
  if (body && typeof body === "object") {
    for (const key of ["detail", "non_field_errors", "frame_id", "message"]) {
      const value = body[key];
      if (typeof value === "string" && value.trim()) return value;
      if (Array.isArray(value) && value.length) return String(value[0]);
    }
  }
  return error?.message || fallback;
};

const paginated = (data) => {
  if (Array.isArray(data)) {
    return { items: data, count: data.length, next: null, previous: null };
  }
  const payload = data && typeof data === "object" ? data : {};
  const items = Array.isArray(payload.results) ? payload.results : [];
  const count = Number(payload.count);
  return {
    items,
    count: Number.isFinite(count) && count >= 0 ? count : items.length,
    next: payload.next ?? null,
    previous: payload.previous ?? null,
  };
};

const cleanShopParams = (params = {}) => ({
  page: params.page || 1,
  ...(params.pageSize != null ? { pageSize: params.pageSize } : {}),
  ...(params.search ? { search: params.search } : {}),
  ...(params.rarity ? { rarity: params.rarity } : {}),
  ...(params.ordering ? { ordering: params.ordering } : {}),
});

const maybeSyncCoinBalance = (dispatch, payload) => {
  const raw = payload?.coin_balance ?? payload?.balance;
  if (raw === null || raw === undefined || raw === "") return;
  const balance = Number(raw);
  if (Number.isFinite(balance) && balance >= 0) {
    dispatch(setCoinBalance(balance));
  }
};

// Refresh after a successful mutation. A failed refresh does not undo
// a successful purchase/equip; only the backend owns that transaction.
const refreshAfterMutation = async (dispatch, getState) => {
  const state = getState()?.profileFrames;
  const requests = [
    dispatch(fetchMyProfileFrames({ page: 1 })).unwrap(),
    dispatch(fetchProfileFrameStats()).unwrap(),
  ];
  if (state?.shop?.loaded) {
    requests.push(
      dispatch(fetchProfileFrameShop(state.shop.params)).unwrap()
    );
  }
  await Promise.allSettled(requests);
};

export const fetchProfileFrameShop = createAsyncThunk(
  "profileFrames/shop",
  async (params = {}, { signal, rejectWithValue }) => {
    try {
      return await ProfileFrameService.getShopFrames({ ...params, signal });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Ramkalar do'konini yuklab bo'lmadi."));
    }
  }
);

export const fetchProfileFrameDetail = createAsyncThunk(
  "profileFrames/detail",
  async (frameId, { signal, rejectWithValue }) => {
    try {
      return await ProfileFrameService.getFrameDetail(frameId, { signal });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Ramka tafsilotlarini yuklab bo'lmadi."));
    }
  }
);

export const fetchMyProfileFrames = createAsyncThunk(
  "profileFrames/inventory",
  async (params = {}, { signal, rejectWithValue }) => {
    try {
      return await ProfileFrameService.getMyFrames({ ...params, signal });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Ramkalar kolleksiyasini yuklab bo'lmadi."));
    }
  }
);

export const fetchProfileFrameStats = createAsyncThunk(
  "profileFrames/stats",
  async (_, { dispatch, signal, rejectWithValue }) => {
    try {
      const data = await ProfileFrameService.getStats({ signal });
      maybeSyncCoinBalance(dispatch, data);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Ramkalar statistikasini yuklab bo'lmadi."));
    }
  }
);

export const purchaseProfileFrame = createAsyncThunk(
  "profileFrames/purchase",
  async (frameId, { dispatch, getState, rejectWithValue }) => {
    let result;
    try {
      result = await ProfileFrameService.purchaseFrame(frameId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Ramkani sotib olib bo'lmadi."));
    }
    maybeSyncCoinBalance(dispatch, result);
    await refreshAfterMutation(dispatch, getState);
    return result;
  }
);

export const equipProfileFrame = createAsyncThunk(
  "profileFrames/equip",
  async (frameId, { dispatch, getState, rejectWithValue }) => {
    let result;
    try {
      result = await ProfileFrameService.equipFrame(frameId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Ramkani o'rnatib bo'lmadi."));
    }
    await refreshAfterMutation(dispatch, getState);
    return result;
  }
);

export const unequipProfileFrame = createAsyncThunk(
  "profileFrames/unequip",
  async (_, { dispatch, getState, rejectWithValue }) => {
    let result;
    try {
      result = await ProfileFrameService.unequipFrame();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Ramkani yechib bo'lmadi."));
    }
    await refreshAfterMutation(dispatch, getState);
    return result;
  }
);

const profileFramesSlice = createSlice({
  name: "profileFrames",
  initialState,
  reducers: {
    clearProfileFrameErrors(state) {
      state.shop.error = null;
      state.inventory.error = null;
      state.detail.error = null;
      state.stats.error = null;
      state.mutation.error = null;
    },
    resetProfileFrames() {
      // Dispatch on logout/account change: never expose a prior user's inventory.
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileFrameShop.pending, (state, action) => {
        state.shop.loading = true;
        state.shop.error = null;
        state.shop.requestId = action.meta.requestId;
        state.shop.params = cleanShopParams(action.meta.arg);
      })
      .addCase(fetchProfileFrameShop.fulfilled, (state, action) => {
        if (state.shop.requestId !== action.meta.requestId) return;
        Object.assign(state.shop, paginated(action.payload));
        state.shop.loading = false;
        state.shop.loaded = true;
        state.shop.requestId = null;
      })
      .addCase(fetchProfileFrameShop.rejected, (state, action) => {
        if (state.shop.requestId !== action.meta.requestId) return;
        state.shop.loading = false;
        state.shop.requestId = null;
        state.shop.error = action.meta.aborted ? null : action.payload || action.error?.message;
      })
      .addCase(fetchMyProfileFrames.pending, (state, action) => {
        state.inventory.loading = true;
        state.inventory.error = null;
        state.inventory.requestId = action.meta.requestId;
        state.inventory.page = action.meta.arg?.page || 1;
      })
      .addCase(fetchMyProfileFrames.fulfilled, (state, action) => {
        if (state.inventory.requestId !== action.meta.requestId) return;
        Object.assign(state.inventory, paginated(action.payload));
        state.inventory.loading = false;
        state.inventory.loaded = true;
        state.inventory.requestId = null;
      })
      .addCase(fetchMyProfileFrames.rejected, (state, action) => {
        if (state.inventory.requestId !== action.meta.requestId) return;
        state.inventory.loading = false;
        state.inventory.requestId = null;
        state.inventory.error = action.meta.aborted ? null : action.payload || action.error?.message;
      })
      .addCase(fetchProfileFrameDetail.pending, (state, action) => {
        state.detail.loading = true;
        state.detail.error = null;
        state.detail.data = null;
        state.detail.frameId = action.meta.arg;
        state.detail.requestId = action.meta.requestId;
      })
      .addCase(fetchProfileFrameDetail.fulfilled, (state, action) => {
        if (state.detail.requestId !== action.meta.requestId) return;
        state.detail.data = action.payload;
        state.detail.loading = false;
        state.detail.requestId = null;
      })
      .addCase(fetchProfileFrameDetail.rejected, (state, action) => {
        if (state.detail.requestId !== action.meta.requestId) return;
        state.detail.loading = false;
        state.detail.requestId = null;
        state.detail.error = action.meta.aborted ? null : action.payload || action.error?.message;
      })
      .addCase(fetchProfileFrameStats.pending, (state, action) => {
        state.stats.loading = true;
        state.stats.error = null;
        state.stats.requestId = action.meta.requestId;
      })
      .addCase(fetchProfileFrameStats.fulfilled, (state, action) => {
        if (state.stats.requestId !== action.meta.requestId) return;
        state.stats.data = action.payload;
        state.stats.loading = false;
        state.stats.loaded = true;
        state.stats.requestId = null;
      })
      .addCase(fetchProfileFrameStats.rejected, (state, action) => {
        if (state.stats.requestId !== action.meta.requestId) return;
        state.stats.loading = false;
        state.stats.requestId = null;
        state.stats.error = action.meta.aborted ? null : action.payload || action.error?.message;
      })
      .addMatcher(
        isAnyOf(purchaseProfileFrame.pending, equipProfileFrame.pending, unequipProfileFrame.pending),
        (state, action) => {
          state.mutation.loading = true;
          state.mutation.type = action.type.split("/").at(-2);
          state.mutation.error = null;
          state.mutation.lastResult = null;
        }
      )
      .addMatcher(
        isAnyOf(purchaseProfileFrame.fulfilled, equipProfileFrame.fulfilled, unequipProfileFrame.fulfilled),
        (state, action) => {
          state.mutation.loading = false;
          state.mutation.error = null;
          state.mutation.lastResult = action.payload;
        }
      )
      .addMatcher(
        isAnyOf(purchaseProfileFrame.rejected, equipProfileFrame.rejected, unequipProfileFrame.rejected),
        (state, action) => {
          state.mutation.loading = false;
          state.mutation.error = action.payload || action.error?.message;
        }
      );
  },
});

export const { clearProfileFrameErrors, resetProfileFrames } = profileFramesSlice.actions;

export const selectProfileFramesState = (state) => state?.profileFrames ?? initialState;
export const selectFrameShop = (state) => selectProfileFramesState(state).shop;
export const selectMyFrames = (state) => selectProfileFramesState(state).inventory;
export const selectFrameDetail = (state) => selectProfileFramesState(state).detail;
export const selectFrameStats = (state) => selectProfileFramesState(state).stats;
export const selectFrameMutation = (state) => selectProfileFramesState(state).mutation;
export const selectEquippedOwnership = (state) =>
  selectMyFrames(state).items.find((item) => item?.is_equipped) || null;

export default profileFramesSlice.reducer;
