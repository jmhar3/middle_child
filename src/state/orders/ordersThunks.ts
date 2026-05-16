import { createAsyncThunk } from "@reduxjs/toolkit";
import { notifications } from "@mantine/notifications";

import { supabase } from "../../supabase";

import type { OrderType, SupabaseOrders } from "../types";

const formatSupaBaseOrders = (supabaseData: SupabaseOrders[]) => {
  return supabaseData.map(({ order_items, ...order }) => ({
    ...order,
    items: order_items.map(({ menu_item, order_items_modifiers, ...item }) => ({
      ...item,
      item: menu_item,
      modifiers: order_items_modifiers.map(({ modifiers }) => modifiers),
    })),
  }));
};

export const fetchOrders = createAsyncThunk("menu/fetchOrders", async () => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `*, user (*),
      order_items (
        *, menu_item (*),
        order_items_modifiers(
          modifiers (*)
        )
      )`,
    )
    .order("due_at");

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

  return formatSupaBaseOrders(data);
});

export const placeOrder = createAsyncThunk(
  "menu/placeOrder",
  async (order: Partial<OrderType>[]) => {
    const { data, error } = await supabase
      .from("orders")
      .insert(order)
      .select(
        `*, user (*),
        order_items (
          *, menu_item (*),
          order_items_modifiers(
            modifiers (*)
          )
        )`,
      );

    if (error) {
      console.log(error);
      throw Error(error.message);
    }

    return formatSupaBaseOrders(data);
  },
);

export const completeOrder = createAsyncThunk(
  "menu/completeOrder",
  async (orderId: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ is_complete: true })
      .eq("id", orderId);

    if (error) {
      console.log(error);
      throw Error(error.message);
    }

    return orderId;
  },
);
