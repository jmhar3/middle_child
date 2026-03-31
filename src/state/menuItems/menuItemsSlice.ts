import { createSlice } from "@reduxjs/toolkit";

import { fetchMenuItems, upsertMenuItems } from "./menuItemsThunks";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface Modifier {
  id: string;
  label: string;
  price?: number;
  is_in_stock?: boolean;
  is_ingredient?: boolean;
  color?: string;
}

export interface ItemOptions {
  id: string;
  label: string;
  allowMultipleSelections: boolean;
  modifiers: Modifier[];
}

export interface MenuItemType {
  id: string;
  label: string;
  description?: string;
  price: number;
  image?: string;
  is_in_stock: boolean;
  has_long_prep_time: boolean;
  is_applicable_loyalty_item: boolean;
  modifiers?: Modifier[];
  modifierCategories?: ItemOptions[];
}

export interface MenuItemsState {
  data: MenuItemType[];
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: MenuItemsState = {
  data: [],
  status: "idle",
};

const menuItemsSlice = createSlice({
  name: "menuItems",
  initialState,
  reducers: {
    menuItemAdded(state, action: PayloadAction<MenuItemType>) {
      const filteredMenuItems = state.data.filter(
        (menuItem) => menuItem.id === action.payload.id,
      );
      state.data = [...filteredMenuItems, action.payload];
    },
    menuItemRemoved(state, action: PayloadAction<MenuItemType>) {
      state.data = state.data.filter(
        (menuItem) => menuItem.id === action.payload.id,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(upsertMenuItems.pending, (state) => {
        state.status = "pending";
      })
      .addCase(upsertMenuItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(upsertMenuItems.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { menuItemAdded, menuItemRemoved } = menuItemsSlice.actions;
export default menuItemsSlice.reducer;

export const selectMenuItems = (state: RootState) => state.menu.data;

export const selectMenuItemById = (state: RootState, menuItemId: string) =>
  state.menuItems.data.find((menuItem) => menuItem.id === menuItemId);

export const selectMenuItemStatus = (state: RootState) =>
  state.menuItems.status;
