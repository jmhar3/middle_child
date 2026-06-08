import { createAsyncThunk } from "@reduxjs/toolkit";
import { notifications } from "@mantine/notifications";

import { supabase } from "../../supabase";

import type { OrderTime } from "../types";

export const fetchOrderTimes = createAsyncThunk(
	"orderTimes/fetchOrderTimes",
	async () => {
		const { data, error } = await supabase
			.from("order_times")
			.select()
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

		return data;
	},
);

export const updateOrderTimes = createAsyncThunk(
	"orderTimes/updateOrderTimes",
	async (params: Partial<OrderTime>[]) => {
		const { data, error } = await supabase
			.from("order_times")
			.upsert(params)
			.select()
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

		return data;
	},
);
