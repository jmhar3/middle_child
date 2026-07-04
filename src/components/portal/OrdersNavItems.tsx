import dayjs from "dayjs";
import { Flex, Stack, Text } from "@mantine/core";

import StyledButton from "../StyledButton";

import { useAppSelector } from "../../state/hooks";
import { selectStoreIsOpen } from "../../state/storeInfo/storeInfoSlice";
import { selectOrders } from "../../state/orders/ordersSlice";

interface OrdersNavItemsProps {
	openToggleStoreOpenModal: () => void;
}

function OrdersNavItems(props: OrdersNavItemsProps) {
	const { openToggleStoreOpenModal } = props;

	const orders = useAppSelector(selectOrders);
	const storeIsOpen = useAppSelector(selectStoreIsOpen);

	const todaysOrders = orders.filter((order) =>
		dayjs(order.due_at).isSame(dayjs(), "day"),
	);

	const todaysTotal = todaysOrders.reduce((acc, order) => acc + order.total, 0);

	const weeksOrders = orders.filter((order) =>
		dayjs(order.due_at).isSame(dayjs(), "isoWeek"),
	);

	const weeklyTotal = weeksOrders.reduce((acc, order) => acc + order.total, 0);

	return (
		<>
			<Stack gap="0">
				<Flex justify="space-between" gap="xs">
					<Text>Today:</Text>
					<Text>${todaysTotal.toFixed(2)}</Text>
				</Flex>
				<Flex justify="space-between" gap="xs">
					<Text>This Week:</Text>
					<Text>${weeklyTotal.toFixed(2)}</Text>
				</Flex>
			</Stack>

			{storeIsOpen && (
				<StyledButton
					variant="outline"
					label="Close Store"
					onClick={openToggleStoreOpenModal}
				/>
			)}
		</>
	);
}

export default OrdersNavItems;
