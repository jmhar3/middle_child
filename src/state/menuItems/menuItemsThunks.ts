import { createAsyncThunk } from "@reduxjs/toolkit";
import { notifications } from "@mantine/notifications";

import type { Modifier } from "../modifiers/modifiersSlice";

import { supabase } from "../../supabase";
import type { MenuItemType } from "./menuItemsSlice";

interface ItemOptions {
  id: string;
  label: string;
  allowMultipleSelections: boolean;
  menu_item_options_modifiers: { modifiers: Modifier }[];
}

interface SupabaseMenuItem {
  id: string;
  label: string;
  price: number;
  image?: string;
  description?: string;
  is_in_stock: boolean;
  has_long_prep_time: boolean;
  is_applicable_loyalty_item: boolean;
  menu_items_modifiers: { modifiers: Modifier }[];
  menu_items_options: { menu_item_options: ItemOptions }[];
}

const formatSupaBaseMenuItems = (supabaseItem: SupabaseMenuItem[]) => {
  return supabaseItem.map(
    ({ menu_items_options, menu_items_modifiers, ...menuItem }) => {
      return {
        ...menuItem,
        modifiers: menu_items_modifiers.map(({ modifiers }) => modifiers),
        modifierCategories: menu_items_options.map(({ menu_item_options }) => ({
          ...menu_item_options,
          modifiers: menu_item_options.menu_item_options_modifiers.map(
            ({ modifiers }) => modifiers,
          ),
        })),
      };
    },
  );
};

export const fetchMenuItems = createAsyncThunk(
  "menuItems/fetchMenuItems",
  async () => {
    const { data, error } = await supabase.from("menu_items").select(`
    *,
    menu_items_options (
      menu_item_options (
        *,
        menu_item_options_modifiers (
         modifiers (*)
        )
      )
    ),
    menu_items_modifiers (
      modifiers (*)
    )
  `);

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

    return formatSupaBaseMenuItems(data);
  },
);

export const upsertMenuItems = createAsyncThunk(
  "menuItems/upsertMenuItems",
  async (params: Partial<MenuItemType>) => {
    const { modifiers, modifierCategories, ...menuItem } = params;

    console.log(modifiers);
    console.log(modifierCategories);

    const { data, error } = await supabase
      .from("menu_items")
      .upsert(menuItem)
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

    return formatSupaBaseMenuItems(data);
  },
);
