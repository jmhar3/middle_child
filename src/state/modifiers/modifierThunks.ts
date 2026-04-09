import { createAsyncThunk } from "@reduxjs/toolkit";
import { notifications } from "@mantine/notifications";

import { supabase } from "../../supabase";

import type { Modifier } from "./modifiersSlice";

export const fetchModifiers = createAsyncThunk(
  "modifiers/fetchModifiers",
  async () => {
    const modifiers = await supabase
      .from("modifiers")
      .select()
      .overrideTypes<Array<Modifier>, { merge: false }>();

    const ingredients = await supabase
      .from("modifiers")
      .select()
      .eq("is_ingredient", true)
      .overrideTypes<Array<Modifier>, { merge: false }>();

    if (modifiers.error) {
      console.error(modifiers.error);
      notifications.show({
        withCloseButton: false,
        message: modifiers.error.message,
        title: modifiers.error.name,
        position: "bottom-right",
        color: "red",
      });
      throw Error(modifiers.error.message);
    }

    if (ingredients.error) {
      console.error(ingredients.error);
      notifications.show({
        withCloseButton: false,
        message: ingredients.error.message,
        title: ingredients.error.name,
        position: "bottom-right",
        color: "red",
      });
      throw Error(ingredients.error.message);
    }

    return { allModifiers: modifiers.data, ingredients: ingredients.data };
  },
);

export const upsertModifier = createAsyncThunk(
  "modifiers/upsertModifier",
  async (modifiers: Partial<Modifier>[]) => {
    const formattedModifiers = modifiers.map((modifier) => ({
      ...modifier,
      price: modifier.price === 0 ? null : modifier.price,
      is_in_stock: modifier.is_ingredient ? modifier.is_in_stock : null,
    }));

    const { data, error } = await supabase
      .from("modifiers")
      .upsert(formattedModifiers)
      .select();

    if (error) {
      console.log(error);
      notifications.show({
        withCloseButton: false,
        message: error.message,
        title: error.name,
        position: "bottom-right",
        color: "red",
      });
      throw Error(error.message);
    }

    return data;
  },
);
