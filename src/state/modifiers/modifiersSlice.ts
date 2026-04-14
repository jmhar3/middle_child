import { createSlice } from "@reduxjs/toolkit";

import {
  deleteModifier,
  fetchModifiers,
  upsertModifiers,
} from "./modifierThunks";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Modifier } from "../types";

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
      .addCase(upsertModifiers.pending, (state) => {
        state.status = "pending";
      })
      .addCase(upsertModifiers.fulfilled, (state, { payload }) => {
        state.status = "succeeded";

        // sort modifiers
        const newModifiers: Modifier[] = [];
        const oldModifiers: Modifier[] = [];

        payload.forEach((item) => {
          if (state.allModifiers.find(({ id }) => id === item.id)) {
            oldModifiers.push(item);
          } else {
            newModifiers.push(item);
          }
        });

        const filteredState = state.allModifiers.filter(
          ({ id: id1 }) => !payload.find(({ id: id2 }) => id1 === id2),
        );

        state.allModifiers = [
          ...filteredState,
          ...oldModifiers,
          ...newModifiers,
        ];

        // sort ingredients
        const newIngredients: Modifier[] = [];
        const oldIngredients: Modifier[] = [];

        payload
          .filter((item) => item.is_ingredient)
          .forEach((item) => {
            if (state.ingredients.find(({ id }) => id === item.id)) {
              oldIngredients.push(item);
            } else {
              newIngredients.push(item);
            }
          });

        const filteredIngredientsState = state.ingredients.filter(
          ({ id: id1 }) => !payload.find(({ id: id2 }) => id1 === id2),
        );

        state.ingredients = [
          ...filteredIngredientsState,
          ...oldModifiers,
          ...newModifiers,
        ];
      })
      .addCase(upsertModifiers.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(deleteModifier.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteModifier.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.allModifiers = state.allModifiers.filter(
          ({ id }) => id !== payload,
        );
        state.ingredients = state.ingredients.filter(
          ({ id }) => id !== payload,
        );
      })
      .addCase(deleteModifier.rejected, (state) => {
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
