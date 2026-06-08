import { createAsyncThunk } from "@reduxjs/toolkit";
import { notifications } from "@mantine/notifications";

import { supabase } from "../../supabase";

import type { MenuSection, SupabaseSection } from "../types";

const formatSupaBaseMenu = (supabaseData: SupabaseSection[]) => {
	return supabaseData.map(({ menu_items, ...section }) => ({
		...section,
		items: menu_items.map(
			({ menu_items_options, menu_items_modifiers, ...item }) => ({
				...item,
				modifiers:
					menu_items_modifiers.length > 0
						? menu_items_modifiers.map(({ modifiers }) => modifiers)
						: undefined,
				modifierCategories:
					menu_items_options.length > 0
						? menu_items_options.map(
								({ options: { options_modifiers, ...options } }) => ({
									...options,
									modifiers: options_modifiers.map(
										({ modifiers }) => modifiers,
									),
								}),
							)
						: undefined,
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
        )
      `,
		)
		.order("order")
		.order("order", {
			referencedTable: "menu_items",
		})
		.order("order", {
			referencedTable: "menu_items.menu_items_options.options",
		})
		.order("order", {
			referencedTable:
				"menu_items.menu_items_options.options.options_modifiers.modifiers",
		})
		.order("order", {
			referencedTable: "menu_items.menu_items_modifiers.modifiers",
		});

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

export const upsertSections = createAsyncThunk(
	"menu/upsertSections",
	async (sections: Partial<MenuSection>[]) => {
		const { data, error } = await supabase
			.from("menu_sections")
			.upsert(sections)
			.select(
				`
          *, menu_items (
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
          )
        `,
			);

		if (error) {
			console.log(error);
			throw Error(error.message);
		}

		return formatSupaBaseMenu(data);
	},
);

export const updateSection = createAsyncThunk(
	"menu/updateSection",
	async ({ id, ...section }: Partial<MenuSection>) => {
		const { data, error } = await supabase
			.from("menu_sections")
			.update(section)
			.eq("id", id)
			.select(
				`
          *, menu_items (
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
