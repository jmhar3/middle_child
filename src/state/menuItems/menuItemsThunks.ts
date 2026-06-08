import { createAsyncThunk } from "@reduxjs/toolkit";
import { notifications } from "@mantine/notifications";

import { supabase } from "../../supabase";

import type { MenuItemType, SupabaseMenuItem } from "../types";

const formatSupaBaseMenuItems: (
	supabaseItem: SupabaseMenuItem[],
) => MenuItemType[] = (supabaseItem: SupabaseMenuItem[]) => {
	return supabaseItem.map(
		({ menu_items_options, menu_items_modifiers, ...menuItem }) => {
			return {
				...menuItem,
				modifiers: menu_items_modifiers.map(({ modifiers }) => modifiers),
				modifierCategories: menu_items_options.map(({ options }) => ({
					...options,
					modifiers: options.options_modifiers.map(
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
		const { data, error } = await supabase
			.from("menu_items")
			.select(
				`
    *,
    menu_items_options (
      options (
        *,
        options_modifiers (
         modifiers (*)
        )
      )
    ),
    menu_items_modifiers (
      modifiers (*)
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

		return formatSupaBaseMenuItems(data);
	},
);

export const upsertMenuItems = createAsyncThunk(
	"menuItems/upsertMenuItems",
	async (menuItems: Partial<MenuItemType>[]) => {
		const formattedMenuItems = menuItems.map((item) => {
			delete item.modifiers;
			delete item.modifierCategories;
			return item;
		});

		const { data, error } = await supabase
			.from("menu_items")
			.upsert(formattedMenuItems)
			.select();

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
