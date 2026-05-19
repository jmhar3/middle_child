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
      modifiers:
        order_items_modifiers.length > 0
          ? order_items_modifiers.map(({ modifiers }) => modifiers)
          : undefined,
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

interface PlaceOrderProps {
  name?: string;
  userId?: string;
  orderData: Partial<OrderType>;
}

export const placeOrder = createAsyncThunk(
  "menu/placeOrder",
  async ({ name, userId, orderData }: PlaceOrderProps) => {
    // create order
    const order = await supabase
      .from("orders")
      .insert({
        name: name || null,
        user: userId || null,
        due_at: orderData.due_at,
        total: orderData.total,
        note: orderData.note,
      })
      .select("id")
      .single();

    if (order.error) {
      console.log(order.error);
      throw Error(order.error.message);
    } else {
      // for each order item, create order item and modifiers
      orderData.items?.forEach(async (item) => {
        const orderItem = await supabase
          .from("order_items")
          .insert({
            order: order.data.id,
            menu_item: item.item.id,
            quantity: item.quantity,
            note: item.note,
          })
          .select()
          .single();

        if (orderItem.error) {
          console.log(orderItem.error);
          throw Error(orderItem.error.message);
        } else {
          if (item.modifiers) {
            item.modifiers.forEach(async (modifier) => {
              await supabase
                .from("order_items_modifiers")
                .insert({
                  order_item_id: orderItem.data.id,
                  modifier_id: modifier.id,
                })
                .select();
            });
          }
        }
      });
    }
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
