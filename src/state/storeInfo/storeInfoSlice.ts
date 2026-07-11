import { createSlice } from "@reduxjs/toolkit";

import { fetchStoreInfo, updateStoreInfo } from "./storeInfoThunks";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { StoreInfo } from "../types";

export interface StoreInfoState {
	data: StoreInfo | null;
	status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: StoreInfoState = {
	data: null,
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
				state.data = action.payload;
			})
			.addCase(fetchStoreInfo.rejected, (state) => {
				state.status = "failed";
			})
			.addCase(updateStoreInfo.pending, (state) => {
				state.status = "pending";
			})
			.addCase(updateStoreInfo.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.data = action.payload;
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
