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
  order: number;
  description?: string;
  is_in_stock: boolean;
  has_long_prep_time: boolean;
  is_applicable_loyalty_item: boolean;
  menu_items_modifiers: { modifiers: Modifier }[];
  menu_items_options: { menu_item_options: ItemOptions }[];
}

interface SupabaseSection {
  id: string;
  label: string;
  order: number;
  menu_items: MenuItemType[];
}

const formatSupaBaseMenu = (supabaseData: SupabaseSection[]) => {
  return supabaseData.map(({ menu_items, ...section }) => ({
    ...section,
    items: menu_items.map(
      ({ menu_items_options, menu_items_modifiers, ...item }) => ({
        ...item,
        modifiers: menu_items_modifiers.map(({ modifiers }) => modifiers),
        modifierCategories: menu_items_options.map(
          ({
            menu_item_options: {
              menu_item_options_modifiers,
              ...menu_item_options
            },
          }) => ({
            ...menu_item_options,
            modifiers: menu_item_options_modifiers.map(
              ({ modifiers }) => modifiers,
            ),
          }),
        ),
      }),
    ),
  }));
};

export const fetchMenu = createAsyncThunk("menu/fetchMenu", async () => {
  const { data, error } = await supabase
    .from("menu_sections")
    .select(
      `
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
      `,
    )
    .order("order");

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

  return formatSupaBaseMenu(data);
});

export const insertSection = createAsyncThunk(
  "menu/insertSection",
  async (section: Partial<Section>) => {
    const { data, error } = await supabase
      .from("menu_sections")
      .insert(section)
      .select(
        `
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
          `,
      );

    if (error) {
      console.log(error);
      throw Error(error.message);
    }

    return formatSupaBaseMenu(data)[0];
  },
);

export const updateSection = createAsyncThunk(
  "menu/updateSection",
  async ({ id, ...section }: Partial<Section>) => {
    const { data, error } = await supabase
      .from("menu_sections")
      .update(section)
      .eq("id", id)
      .select(
        `
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
        `,
      );

    if (error) {
      console.log(error);
      throw Error(error.message);
    }

    return formatSupaBaseMenu(data)[0];
  },
);

export const deleteSection = createAsyncThunk(
  "menu/deleteSection",
  async (id: string) => {
    const { error } = await supabase
      .from("menu_sections")
      .delete()
      .eq("id", id);

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

    return id;
  },
);
