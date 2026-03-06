import { createAsyncThunk } from "@reduxjs/toolkit";
import { notifications } from "@mantine/notifications";

import type { Section } from "./menuSlice";
import type { Modifier } from "../modifiers/modifiersSlice";

import { supabase } from "../../supabase";

interface ItemOptions {
  id: string;
  label: string;
  allowMultipleSelections: boolean;
  menu_item_options_modifiers: { modifiers: Modifier }[];
}

interface MenuItemType {
  id: string;
  label: string;
  price: number;
  image?: string;
  is_in_stock?: boolean;
  has_long_prep_time?: boolean;
  is_applicable_loyalty_item?: boolean;
  menu_items_modifiers: { modifiers: Modifier }[];
  menu_items_options: { menu_item_options: ItemOptions }[];
}

interface SupabaseMenuData {
  id: string;
  label: string;
  order: number;
  menu_items: MenuItemType[];
}

const formatSupaBaseMenu = (supabaseData: SupabaseMenuData[]) => {
  return supabaseData.map((section) => ({
    ...section,
    items: section.menu_items.map((item) => ({
      ...item,
      modifiers: item.menu_items_modifiers.map(({ modifiers }) => modifiers),
      modifierCategories: item.menu_items_options.map(
        ({ menu_item_options }) => ({
          ...menu_item_options,
          modifiers: menu_item_options.menu_item_options_modifiers.map(
            ({ modifiers }) => modifiers,
          ),
        }),
      ),
    })),
  }));
};

export const fetchMenu = createAsyncThunk("menu/fetchMenu", async () => {
  const { count, data, error } = await supabase.from("menu_sections").select(`
        *, menu_items (
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

  return {
    menuLength: count || 0,
    menu: formatSupaBaseMenu(data),
  };
});

export const upsertSection = createAsyncThunk(
  "menu/upsertSection",
  async (params: Partial<Section>) => {
    const { count, data, error } = await supabase
      .from("modifiers")
      .upsert(params)
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

    return { menuLength: count, menu: formatSupaBaseMenu(data) };
  },
);
