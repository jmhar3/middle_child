import { createSlice } from "@reduxjs/toolkit";

import { fetchStoreInfo, updateStoreInfo } from "./storeInfoThunks";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface StoreInfo {
  id: string;
  is_open: boolean;
  current_order_time: OrderTime;
  weekly_records: string;
}

export interface OrderTime {
  id: string;
  label: string;
  short: number;
  long: number;
}

export interface StoreInfoState {
  data: StoreInfo;
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: StoreInfoState = {
  data: {
    id: "",
    is_open: false,
    current_order_time: {
      id: "",
      label: "",
      short: 10,
      long: 15,
    },
    weekly_records: JSON.stringify({}),
  },
  status: "idle",
};

const storeInfoSlice = createSlice({
  name: "storeInfo",
  initialState,
  reducers: {
    storeInfoUpdated(state, action: PayloadAction<StoreInfo>) {
      state = { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreInfo.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchStoreInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload) state.data = action.payload;
      })
      .addCase(fetchStoreInfo.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updateStoreInfo.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateStoreInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload) state.data = action.payload;
      })
      .addCase(updateStoreInfo.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { storeInfoUpdated } = storeInfoSlice.actions;
export default storeInfoSlice.reducer;

export const selectStoreInfo = (state: RootState) => state.storeInfo.data;

export const selectStoreInfoStatus = (state: RootState) =>
  state.storeInfo.status;

export const selectStoreIsOpen = (state: RootState) =>
  state.storeInfo.data?.is_open;

export const selectStoreInfoCurrentOrderTime = (state: RootState) =>
  state.storeInfo.data?.current_order_time;

export const selectStoreInfoWeeklyRecords = (state: RootState) =>
  state.storeInfo.data?.weekly_records;
