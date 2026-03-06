import { createAsyncThunk } from "@reduxjs/toolkit";
import { notifications } from "@mantine/notifications";

import { supabase } from "../../supabase";

import type { ItemOption } from "./itemOptionsSlice";
import type { Modifier } from "../modifiers/modifiersSlice";

export const fetchItemOptions = createAsyncThunk(
  "itemOptions/fetchItemOptions",
  async () => {
    const { data, error } = await supabase.from("menu_item_options").select(
      `
        *,
        menu_item_options_modifiers (
          modifiers (*)
        )`,
    );

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

    return data.map((itemOption) => ({
      ...itemOption,
      modifiers: itemOption.menu_item_options_modifiers.map(
        ({ modifiers }: { modifiers: Modifier }) => modifiers,
      ),
    }));
  },
);

export const upsertItemOption = createAsyncThunk(
  "itemOptions/upsertItemOption",
  async (params: ItemOption) => {
    const { error } = await supabase.from("menu_item_options").upsert(params);

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
  },
);
