import { createSlice } from "@reduxjs/toolkit";

import { fetchItemOptions } from "./itemOptionThunks";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Modifier } from "../modifiers/modifiersSlice";

export interface ItemOption {
  id: string;
  label: string;
  allowMultipleSelections: boolean;
  modifiers: Modifier[];
}

export interface ItemOptionsState {
  data: ItemOption[];
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
    itemOptionAdded(state, action: PayloadAction<ItemOption>) {
      const filteredItemOptions = state.data.filter(
        (itemOption) => itemOption.id === action.payload.id,
      );
      state.data = [...filteredItemOptions, action.payload];
    },
    itemOptionRemoved(state, action: PayloadAction<ItemOption>) {
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
