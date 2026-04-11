import { createSlice } from "@reduxjs/toolkit";

import { fetchMenu, deleteSection, upsertSections } from "./menuThunks";

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
  allow_multiple_selections: boolean;
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
  order: number;
}

export interface Section {
  id: string;
  label: string;
  order: number;
  items: MenuItemType[];
}

export interface MenuState {
  data: Section[];
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: MenuState = {
  data: [],
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
        state.data = action.payload;
      })
      .addCase(fetchMenu.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(upsertSections.pending, (state) => {
        state.status = "pending";
      })
      .addCase(upsertSections.fulfilled, (state, { payload }) => {
        state.status = "succeeded";

        const newSections: Section[] = [];
        const oldSections: Section[] = [];

        payload.forEach((item) => {
          if (state.data.find(({ id }) => id === item.id)) {
            oldSections.push(item);
          } else {
            newSections.push(item);
          }
        });

        const filteredState = state.data.filter(
          ({ id: id1 }) => !payload.find(({ id: id2 }) => id1 === id2),
        );

        state.data = [...filteredState, ...oldSections, ...newSections].sort(
          (a, b) => a.order - b.order,
        );
      })
      .addCase(upsertSections.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(deleteSection.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteSection.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.data = state.data.filter(({ id }) => id !== payload);
      })
      .addCase(deleteSection.rejected, (state) => {
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

export const selectMenuLength = (state: RootState) => state.menu.data.length;
