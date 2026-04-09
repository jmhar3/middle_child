import { createSlice } from "@reduxjs/toolkit";

import { fetchModifiers, upsertModifier } from "./modifierThunks";

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

export interface ModifiersState {
  allModifiers: Modifier[];
  ingredients: Modifier[];
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: ModifiersState = {
  allModifiers: [],
  ingredients: [],
  status: "idle",
};

const modifiersSlice = createSlice({
  name: "modifiers",
  initialState,
  reducers: {
    modifierAdded(state, action: PayloadAction<Modifier>) {
      const filteredModifiers = state.allModifiers.filter(
        (modifier) => modifier.id === action.payload.id,
      );
      state.allModifiers = [...filteredModifiers, action.payload];
    },
    modifierRemoved(state, action: PayloadAction<Modifier>) {
      state.allModifiers = state.allModifiers.filter(
        (modifier) => modifier.id === action.payload.id,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModifiers.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchModifiers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allModifiers = action.payload.allModifiers;
        state.ingredients = action.payload.ingredients;
      })
      .addCase(fetchModifiers.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(upsertModifier.pending, (state) => {
        state.status = "pending";
      })
      .addCase(upsertModifier.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allModifiers = [...state.allModifiers, ...action.payload];
      })
      .addCase(upsertModifier.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { modifierAdded, modifierRemoved } = modifiersSlice.actions;
export default modifiersSlice.reducer;

export const selectAllModifiers = (state: RootState) =>
  state.modifiers.allModifiers;

export const selectModifierById = (state: RootState, modifierId: string) =>
  state.modifiers.allModifiers.find((modifier) => modifier.id === modifierId);

export const selectModifiersStatus = (state: RootState) =>
  state.modifiers.status;

export const selectAllIngredients = (state: RootState) =>
  state.modifiers.ingredients;
