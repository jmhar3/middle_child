import { createSlice } from "@reduxjs/toolkit";

import {
	deleteMenuItem,
	fetchMenuItems,
	upsertMenuItems,
} from "./menuItemsThunks";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { MenuItemType } from "../types";

export interface MenuItemsState {
	data: MenuItemType[];
	status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: MenuItemsState = {
	data: [],
	status: "idle",
};

const menuItemsSlice = createSlice({
	name: "menuItems",
	initialState,
	reducers: {
		menuItemAdded(state, action: PayloadAction<MenuItemType>) {
			const filteredMenuItems = state.data.filter(
				(menuItem) => menuItem.id === action.payload.id,
			);
			state.data = [...filteredMenuItems, action.payload];
		},
		menuItemRemoved(state, action: PayloadAction<MenuItemType>) {
			state.data = state.data.filter(
				(menuItem) => menuItem.id === action.payload.id,
			);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchMenuItems.pending, (state) => {
				state.status = "pending";
			})
			.addCase(fetchMenuItems.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.data = action.payload;
			})
			.addCase(fetchMenuItems.rejected, (state) => {
				state.status = "failed";
			})
			.addCase(upsertMenuItems.pending, (state) => {
				state.status = "pending";
			})
			.addCase(upsertMenuItems.fulfilled, (state, { payload }) => {
				state.status = "succeeded";

				const newMenuItems: MenuItemType[] = [];
				const oldMenuItems: MenuItemType[] = [];

				payload.forEach((item) => {
					if (state.data.find(({ id }) => id === item.id)) {
						oldMenuItems.push(item);
					} else {
						newMenuItems.push(item);
					}
				});

				const filteredState = state.data.filter(
					({ id: id1 }) => !payload.find(({ id: id2 }) => id1 === id2),
				);

				state.data = [...filteredState, ...oldMenuItems, ...newMenuItems];
			})
			.addCase(upsertMenuItems.rejected, (state) => {
				state.status = "failed";
			})
			.addCase(deleteMenuItem.pending, (state) => {
				state.status = "pending";
			})
			.addCase(deleteMenuItem.fulfilled, (state, { payload }) => {
				state.status = "succeeded";
				state.data = state.data.filter(({ id }) => id !== payload);
			})
			.addCase(deleteMenuItem.rejected, (state) => {
				state.status = "failed";
			});
	},
});

export const { menuItemAdded, menuItemRemoved } = menuItemsSlice.actions;
export default menuItemsSlice.reducer;

export const selectMenuItems = (state: RootState) => state.menu.data;

export const selectMenuItemById = (state: RootState, menuItemId: string) =>
	state.menuItems.data.find((menuItem) => menuItem.id === menuItemId);

export const selectMenuItemStatus = (state: RootState) =>
	state.menuItems.status;
