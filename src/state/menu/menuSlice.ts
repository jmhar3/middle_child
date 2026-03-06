import { createSlice } from "@reduxjs/toolkit";

import { fetchMenu, upsertSection } from "./menuThunks";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// to be removed
import type { MenuItemType } from "../../types/menu";

export interface Section {
  id: string;
  label: string;
  order: number;
  items: MenuItemType[];
}

export interface MenuState {
  data: Section[];
  menuLength: number;
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: MenuState = {
  data: [],
  menuLength: 0,
  status: "idle",
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    sectionAdded(state, action: PayloadAction<Section>) {
      const filteredMenu = state.data.filter(
        (section) => section.id === action.payload.id,
      );
      state.data = [...filteredMenu, action.payload];
    },
    sectionRemoved(state, action: PayloadAction<Section>) {
      state.data = state.data.filter(
        (section) => section.id === action.payload.id,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.menu;
        state.menuLength = action.payload.menuLength;
      })
      .addCase(fetchMenu.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(upsertSection.pending, (state) => {
        state.status = "pending";
      })
      .addCase(upsertSection.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.menu;
        if (action.payload.menuLength)
          state.menuLength = action.payload.menuLength;
      })
      .addCase(upsertSection.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { sectionAdded, sectionRemoved } = menuSlice.actions;
export default menuSlice.reducer;

export const selectMenu = (state: RootState) => state.menu.data;

export const selectSectionById = (state: RootState, sectionId: string) =>
  state.menu.data.find((section) => section.id === sectionId);

export const selectMenuStatus = (state: RootState) => state.menu.status;

export const selectMenuLength = (state: RootState) => state.menu.menuLength;
