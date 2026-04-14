import { createAsyncThunk } from "@reduxjs/toolkit";
import { notifications } from "@mantine/notifications";

import { supabase } from "../../supabase";
import type { OrderType } from "../types";

// const formatSupaBaseMenu = (supabaseData: SupabaseSection[]) => {
//   return supabaseData.map(({ menu_items, ...section }) => ({
//     ...section,
//     items: menu_items.map(
//       ({ menu_items_options, menu_items_modifiers, ...item }) => ({
//         ...item,
//         modifiers: menu_items_modifiers.map(({ modifiers }) => modifiers),
//         modifierCategories: menu_items_options.map(
//           ({ options: { options_modifiers, ...options } }) => ({
//             ...options,
//             modifiers: options_modifiers.map(({ modifiers }) => modifiers),
//           }),
//         ),
//       }),
//     ),
//   }));
// };

export const fetchOrders = createAsyncThunk("menu/fetchOrders", async () => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `*, order_items (
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

  return data;
});

export const insertOrder = createAsyncThunk(
  "menu/insertOrder",
  async (sections: Partial<OrderType>[]) => {
    const { data, error } = await supabase.from("orders").insert(sections);

    if (error) {
      console.log(error);
      throw Error(error.message);
    }

    return data;
  },
);

export const completeOrder = createAsyncThunk(
  "menu/completeOrder",
  async (orderId: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ is_completed: true })
      .eq("id", orderId);

    if (error) {
      console.log(error);
      throw Error(error.message);
    }

    return orderId;
  },
);
