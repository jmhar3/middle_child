import { createSlice } from "@reduxjs/toolkit";

import { fetchOrderTimes, updateOrderTimes } from "./orderTimesThunks";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { OrderTime } from "../types";

export interface OrderTimesState {
	data: OrderTime[];
	status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: OrderTimesState = {
	data: [],
	status: "idle",
};

const orderTimesSlice = createSlice({
	name: "orderTimes",
	initialState,
	reducers: {
		orderTimeAdded(state, action: PayloadAction<OrderTime>) {
			const filteredOrderTimes = state.data.filter(
				(orderTime) => orderTime.id === action.payload.id,
			);
			state.data = [...filteredOrderTimes, action.payload];
		},
		orderTimeUpdated(state, action: PayloadAction<OrderTime>) {
			state.data = state.data.filter(
				(orderTime) => orderTime.id === action.payload.id,
			);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchOrderTimes.pending, (state) => {
				state.status = "pending";
			})
			.addCase(fetchOrderTimes.fulfilled, (state, action) => {
				state.status = "succeeded";
				if (action.payload) state.data = action.payload;
			})
			.addCase(fetchOrderTimes.rejected, (state) => {
				state.status = "failed";
			})
			.addCase(updateOrderTimes.pending, (state) => {
				state.status = "pending";
			})
			.addCase(updateOrderTimes.fulfilled, (state, action) => {
				state.status = "succeeded";
				if (action.payload) state.data = action.payload;
			})
			.addCase(updateOrderTimes.rejected, (state) => {
				state.status = "failed";
			});
	},
});

export const { orderTimeAdded, orderTimeUpdated } = orderTimesSlice.actions;
export default orderTimesSlice.reducer;

export const selectAllOrderTimes = (state: RootState) => state.orderTimes.data;

export const selectOrderTimeById = (state: RootState, orderTimeId: string) =>
	state.orderTimes.data.find((orderTime) => orderTime.id === orderTimeId);

export const selectOrderTimesStatus = (state: RootState) =>
	state.orderTimes.status;
