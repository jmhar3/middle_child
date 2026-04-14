import { createAsyncThunk } from "@reduxjs/toolkit";
import { notifications } from "@mantine/notifications";

import { supabase } from "../../supabase";

import type { ItemOption } from "./itemOptionsSlice";
import type { Modifier } from "../modifiers/modifiersSlice";

interface SupabaseItemOption extends ItemOption {
  options_modifiers: { modifiers: Modifier }[];
}

const formatData = (data: SupabaseItemOption[]) =>
  data.map((itemOption) => {
    const { options_modifiers, ...option } = itemOption;

    return {
      ...option,
      modifiers: options_modifiers.map(
        ({ modifiers }: { modifiers: Modifier }) => modifiers,
      ),
    };
  });

export const fetchItemOptions = createAsyncThunk(
  "itemOptions/fetchItemOptions",
  async () => {
    const { data, error } = await supabase.from("options").select(
      `
        *,
        options_modifiers (
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

    return formatData(data);
  },
);

export const upsertOptions = createAsyncThunk(
  "itemOptions/upsertOptions",
  async (params: Partial<ItemOption>[]) => {
    const { data, error } = await supabase
      .from("options")
      .upsert(params)
      .select();

    if (error) {
      console.log(error);
      throw Error(error.message);
    }

    return formatData(data);
  },
);
