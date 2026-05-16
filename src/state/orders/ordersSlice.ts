import { createSlice } from "@reduxjs/toolkit";

import { completeOrder, fetchOrders, placeOrder } from "./ordersThunks";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { OrderType } from "../types";

export interface OrdersState {
  data: OrderType[];
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: OrdersState = {
  data: [],
  status: "idle",
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    sectionAdded(state, action: PayloadAction<OrderType>) {
      const filteredOrders = state.data.filter(
        (section) => section.id === action.payload.id,
      );
      state.data = [...filteredOrders, action.payload];
    },
    sectionRemoved(state, action: PayloadAction<OrderType>) {
      state.data = state.data.filter(
        (section) => section.id === action.payload.id,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(placeOrder.pending, (state) => {
        state.status = "pending";
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(placeOrder.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(completeOrder.pending, (state) => {
        state.status = "pending";
      })
      .addCase(completeOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.map((order) => {
          if (order.id === action.payload)
            return { ...order, is_complete: true };
          return order;
        });
      })
      .addCase(completeOrder.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { sectionAdded, sectionRemoved } = ordersSlice.actions;
export default ordersSlice.reducer;

export const selectOrders = (state: RootState) => state.orders.data;

export const selectSectionById = (state: RootState, sectionId: string) =>
  state.orders.data.find((section) => section.id === sectionId);

export const selectOrdersStatus = (state: RootState) => state.orders.status;
