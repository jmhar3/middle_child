import { useMemo } from "react";
import { Stack } from "@mantine/core";

import Order from "./Order";

import type { OrderType } from "../../../state/types";

interface OrdersProps {
	orders: OrderType[];
}

function OrdersList({ orders }: OrdersProps) {
	const sortedOrders = useMemo(() => {
		const incompleteOrders = orders.filter((order) => !order.is_complete);
		const completedOrders = orders.filter((order) => order.is_complete);
		return [...incompleteOrders, ...completedOrders];
	}, [orders]);

	return (
		<Stack w="100%" px="sm">
			{sortedOrders.map((order) => (
				<Order key={order.id} order={order} />
			))}
		</Stack>
	);
}

export default OrdersList;
