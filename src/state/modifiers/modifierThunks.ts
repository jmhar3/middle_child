import { createAsyncThunk } from "@reduxjs/toolkit";
import { notifications } from "@mantine/notifications";

import { supabase } from "../../supabase";
import type { Modifier } from "../types";

export const fetchModifiers = createAsyncThunk(
	"modifiers/fetchModifiers",
	async () => {
		const modifiers = await supabase
			.from("modifiers")
			.select()
			.overrideTypes<Array<Modifier>, { merge: false }>();

		const ingredients = await supabase
			.from("modifiers")
			.select()
			.eq("is_ingredient", true)
			.overrideTypes<Array<Modifier>, { merge: false }>();

		if (modifiers.error) {
			console.error(modifiers.error);
			notifications.show({
				withCloseButton: false,
				message: modifiers.error.message,
				title: modifiers.error.name,
				position: "bottom-right",
				color: "red",
			});
			throw Error(modifiers.error.message);
		}

		if (ingredients.error) {
			console.error(ingredients.error);
			notifications.show({
				withCloseButton: false,
				message: ingredients.error.message,
				title: ingredients.error.name,
				position: "bottom-right",
				color: "red",
			});
			throw Error(ingredients.error.message);
		}

		return { allModifiers: modifiers.data, ingredients: ingredients.data };
	},
);

export const upsertModifiers = createAsyncThunk(
	"modifiers/upsertModifiers",
	async (modifiers: Partial<Modifier>[]) => {
		const formattedModifiers = modifiers.map((modifier) => ({
			...modifier,
			is_in_stock: modifier.is_ingredient ? modifier.is_in_stock : null,
		}));

		const { data, error } = await supabase
			.from("modifiers")
			.upsert(formattedModifiers)
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

		return data;
	},
);

export const updateModifier = createAsyncThunk(
	"modifiers/updateModifier",
	async ({ id, ...modifier }: Partial<Modifier>) => {
		const formattedModifier = {
			...modifier,
			is_in_stock: modifier.is_ingredient ? modifier.is_in_stock : null,
		};

		const { data, error } = await supabase
			.from("modifiers")
			.update(formattedModifier)
			.eq("id", id)
			.select()
			.single();

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
	},
);

interface InsertModifierParams {
	modifier: Partial<Modifier>;
	itemId?: string;
	optionId?: string;
}

export const insertModifier = createAsyncThunk(
	"modifiers/insertModifier",
	async ({ modifier, itemId, optionId }: InsertModifierParams) => {
		const formattedModifier = {
			...modifier,
			is_in_stock: modifier.is_ingredient ? modifier.is_in_stock : null,
		};

		const { data, error } = await supabase
			.from("modifiers")
			.insert(formattedModifier)
			.select()
			.single();

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

		if (itemId) {
			const itemModifier = await supabase
				.from("menu_items_modifiers")
				.insert({ menu_item_id: itemId, modifier_id: data.id });

			if (itemModifier.error) {
				console.error(itemModifier.error);
				notifications.show({
					withCloseButton: false,
					message: itemModifier.error.message,
					title: itemModifier.error.name,
					position: "bottom-right",
					color: "red",
				});
				throw Error(itemModifier.error.message);
			}
		}

		if (optionId) {
			const optionModifier = await supabase
				.from("options_modifiers")
				.insert({ option_id: optionId, modifier_id: data.id });

			if (optionModifier.error) {
				console.error(optionModifier.error);
				notifications.show({
					withCloseButton: false,
					message: optionModifier.error.message,
					title: optionModifier.error.name,
					position: "bottom-right",
					color: "red",
				});
				throw Error(optionModifier.error.message);
			}
		}

		return data;
	},
);

export const deleteModifier = createAsyncThunk(
	"menu/deleteModifier",
	async (id: string) => {
		const { error } = await supabase.from("modifiers").delete().eq("id", id);

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

		return id;
	},
);
