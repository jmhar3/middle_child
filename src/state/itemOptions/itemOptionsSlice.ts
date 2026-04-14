import { createSlice } from "@reduxjs/toolkit";

import { fetchItemOptions, upsertOptions } from "./itemOptionThunks";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { ItemOptions } from "../types";

export interface ItemOptionsState {
  data: ItemOptions[];
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: ItemOptionsState = {
  data: [],
  status: "idle",
};

const itemOptionsSlice = createSlice({
  name: "itemOptions",
  initialState,
  reducers: {
    itemOptionAdded(state, action: PayloadAction<ItemOptions>) {
      const filteredItemOptions = state.data.filter(
        (itemOption) => itemOption.id === action.payload.id,
      );
      state.data = [...filteredItemOptions, action.payload];
    },
    itemOptionRemoved(state, action: PayloadAction<ItemOptions>) {
      state.data = state.data.filter(
        (itemOption) => itemOption.id === action.payload.id,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemOptions.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchItemOptions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchItemOptions.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(upsertOptions.pending, (state) => {
        state.status = "pending";
      })
      .addCase(upsertOptions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(upsertOptions.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { itemOptionAdded, itemOptionRemoved } = itemOptionsSlice.actions;
export default itemOptionsSlice.reducer;

export const selectAllItemOptions = (state: RootState) =>
  state.itemOptions.data;

export const selectItemOptionById = (state: RootState, itemOptionId: string) =>
  state.itemOptions.data.find((itemOption) => itemOption.id === itemOptionId);

export const selectItemOptionsStatus = (state: RootState) =>
  state.itemOptions.status;
