import { createAsyncThunk } from "@reduxjs/toolkit";
import { notifications } from "@mantine/notifications";

import { supabase } from "../../supabase";

import type { OrderItem, SupabaseOrders, User } from "../types";

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

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return null;

	const publicUser = await supabase
		.from("users")
		.select()
		.eq("id", user.id)
		.single();

	if (publicUser.error) {
		console.error(publicUser.error);
		notifications.show({
			withCloseButton: false,
			message: publicUser.error.message,
			title: publicUser.error.name,
			position: "bottom-right",
			color: "red",
		});
		throw Error(publicUser.error.message);
	}

	const userOrders = await supabase
		.from("orders")
		.select(
			`*,
      order_items (
        *, menu_item (*),
        order_items_modifiers(
          modifiers (*)
        )
      )`,
		)
		.eq("user", user.id)
		.order("due_at");

	if (userOrders.error) {
		console.error(userOrders.error);
		notifications.show({
			withCloseButton: false,
			message: userOrders.error.message,
			title: userOrders.error.name,
			position: "bottom-right",
			color: "red",
		});
		throw Error(userOrders.error.message);
	}

	const formattedOrders = formatSupaBaseOrders(userOrders.data);

	const formattedItems = formattedOrders.flatMap(({ items }) => items);

	const uniqueOrderItems: OrderItem[] = [];

	formattedItems.forEach((item) => {
		const findExistingItem = uniqueOrderItems.find(
			(existingItem) =>
				existingItem.item.id === item.item.id &&
				JSON.stringify(existingItem.modifiers) ===
					JSON.stringify(item.modifiers) &&
				existingItem.note === item.note,
		);
		if (!findExistingItem) {
			uniqueOrderItems.push(item);
		}
	});

	return {
		...publicUser.data,
		orders: formattedOrders,
		recent_items: uniqueOrderItems.length > 0 ? uniqueOrderItems : null,
	};
});

export const updateUser = createAsyncThunk(
	"user/updateUser",
	async ({ id, ...user }: Partial<Omit<User, "orders">>) => {
		const { error } = await supabase.from("users").update(user).eq("id", id);

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
	},
);

interface SignUpUserProps {
	email: string;
	password: string;
	name: string;
}

export const signUpUser = createAsyncThunk(
	"user/signUpUser",
	async ({ email, password, name }: SignUpUserProps) => {
		const { error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				data: {
					name: name,
				},
			},
		});

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
	},
);

export const resendConfirmation = createAsyncThunk(
	"user/resendConfirmation",
	async ({ email }: { email: string }) => {
		const { error } = await supabase.auth.resend({
			type: "signup",
			email: email,
		});

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
	},
);

export const resetPassword = createAsyncThunk(
	"user/resetPassword",
	async ({ email }: { email: string }) => {
		const { error } = await supabase.auth.resetPasswordForEmail(email);

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
	},
);

export const signInUser = createAsyncThunk(
	"user/signInUser",
	async ({ email, password }: { email: string; password: string }) => {
		const { error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

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
	},
);

export const signOutUser = createAsyncThunk("user/signOutUser", async () => {
	const { error } = await supabase.auth.signOut();

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
});

interface SetUserParams {
	access_token: string;
	refresh_token: string;
}

export const setUser = createAsyncThunk(
	"user/setUser",
	async ({ access_token, refresh_token }: SetUserParams) => {
		const { error } = await supabase.auth.setSession({
			access_token: access_token,
			refresh_token: refresh_token,
		});

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
	},
);
