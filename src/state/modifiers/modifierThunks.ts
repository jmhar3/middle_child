import { createAsyncThunk } from "@reduxjs/toolkit";
import { notifications } from "@mantine/notifications";

import { supabase } from "../../supabase";

import type { Modifier } from "./modifiersSlice";

export const fetchModifiers = createAsyncThunk(
  "modifiers/fetchModifiers",
  async () => {
    const { data, error } = await supabase
      .from("modifiers")
      .select()
      .overrideTypes<Array<Modifier>, { merge: false }>();

    if (error) {
      console.error(error);
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
