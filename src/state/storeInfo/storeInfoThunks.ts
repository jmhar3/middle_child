import { createAsyncThunk } from "@reduxjs/toolkit";
import { notifications } from "@mantine/notifications";

import { supabase } from "../../supabase";

import type { StoreInfo } from "../types";

export const fetchStoreInfo = createAsyncThunk(
  "storeInfo/fetchStoreInfo",
  async () => {
    const { data, error } = await supabase
      .from("store_info")
      .select("*, current_order_time (id, label, short, long)")
      .eq("id", "bb1749fd-91a9-4fc4-bd22-7b9ced12c0d9")
      .overrideTypes<Array<StoreInfo>, { merge: false }>();

    if (data) {
      return data[0];
    }

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
  },
);

export const updateStoreInfo = createAsyncThunk(
  "storeInfo/updateStoreInfo",
  async ({ id, current_order_time, is_open }: Partial<StoreInfo>) => {
    const { data, error } = await supabase
      .from("store_info")
      .update({ current_order_time: current_order_time?.id, is_open: is_open })
      .eq("id", id)
      .select("*, current_order_time (id, label, short, long)");

    if (error) {
      notifications.show({
        withCloseButton: false,
        message: error.message,
        title: error.name,
        position: "bottom-right",
        color: "red",
      });
      console.error(error);
      throw Error(error.message);
    }

    if (data) {
      return data[0];
    }
  },
);
