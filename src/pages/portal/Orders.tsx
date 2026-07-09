import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useEffect, useMemo, useState } from "react";
import { notifications } from "@mantine/notifications";
import { Box, Group, Stack, Text } from "@mantine/core";

import fartSound from "/assets/fart1.mp3";

import Order from "../../components/portal/orders/Order";
import StyledButton from "../../components/StyledButton";
import ToggleStoreOpenModal from "../../components/portal/orders/ToggleStoreOpenModal";

import { supabase } from "../../supabase";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { selectOrders } from "../../state/orders/ordersSlice";
import { fetchOrders } from "../../state/orders/ordersThunks";
import { updateStoreInfo } from "../../state/storeInfo/storeInfoThunks";
import { selectAllOrderTimes } from "../../state/orderTimes/orderTimesSlice";

import {
	selectStoreInfo,
	selectStoreIsOpen,
} from "../../state/storeInfo/storeInfoSlice";

import type { OrderTime } from "../../state/types";

dayjs.extend(isoWeek);

interface OrdersProps {
	showToggleStoreOpenModal: boolean;
	openToggleStoreOpenModal: () => void;
	closeToggleStoreOpenModal: () => void;
}

function Orders(props: OrdersProps) {
	const audioNotification = new Audio(fartSound);

	const [isUpdatingOrderTime, setIsUpdatingOrderTime] = useState(false);

	const dispatch = useAppDispatch();
	const orderTimes = useAppSelector(selectAllOrderTimes);
	const storeInfo = useAppSelector(selectStoreInfo);
	const storeIsOpen = useAppSelector(selectStoreIsOpen);
	const orders = useAppSelector(selectOrders);

	useEffect(() => {
		const setAuth = async () => {
			try {
				await supabase.realtime.setAuth();
			} catch (error) {
				console.error("Failed to set realtime auth", error);
			}
		};

		setAuth();
	}, []);

	supabase
		.channel("orders:created", {
			config: {
				private: true,
			},
		})
		.on(
			"broadcast",
			{
				event: "INSERT",
			},
			() => {
				dispatch(fetchOrders());
				audioNotification.play().catch((error) => {
					console.error(
						"Audio playback failed, likely due to browser autoplay policies:",
						error,
					);
				});
			},
		)
		.subscribe();

	const todaysOrders = orders.filter((order) =>
		dayjs(order.due_at).isSame(dayjs(), "day"),
	);

	const sortedOrders = useMemo(() => {
		const incompleteOrders = orders.filter((order) => !order.is_complete);
		const completedOrders = orders.filter((order) => order.is_complete);
		return [...incompleteOrders, ...completedOrders];
	}, [orders]);

	const onUpdateCurrentOrderTime = (selectedOrderTime: OrderTime) => {
		setIsUpdatingOrderTime(true);
		dispatch(
			updateStoreInfo({ ...storeInfo, current_order_time: selectedOrderTime }),
		)
			.catch((error) =>
				notifications.show({
					message: error,
					withCloseButton: false,
					position: "bottom-right",
					color: "red",
				}),
			)
			.finally(() => {
				setIsUpdatingOrderTime(false);
			});
	};

	return (
		<>
			{storeInfo && (
				<ToggleStoreOpenModal
					isOpen={props.showToggleStoreOpenModal}
					onClose={props.closeToggleStoreOpenModal}
				/>
			)}

			{storeInfo && orderTimes && (
				<Box px="sm">
					<Group
						grow
						p="sm"
						w="100%"
						bdrs="sm"
						bg="white"
						style={{ zIndex: 0 }}
					>
						{orderTimes.map((orderTime) => (
							<StyledButton
								key={orderTime.label}
								label={`${orderTime.label}: ${orderTime.short}+ mins`}
								onClick={() => onUpdateCurrentOrderTime(orderTime)}
								isLoading={isUpdatingOrderTime}
								variant={
									orderTime.id === storeInfo.current_order_time.id
										? "filled"
										: "outline"
								}
							/>
						))}
					</Group>
				</Box>
			)}

			{storeIsOpen ? (
				todaysOrders &&
				todaysOrders.length > 0 && (
					<Stack w="100%" px="sm">
						{sortedOrders.map((order) => (
							<Order key={order.id} order={order} />
						))}
					</Stack>
				)
			) : (
				<Stack align="center" gap="sm" pt="3em">
					<Text ta="center" mb="sm" size="1.6em" fw="600">
						Middle Child is currently closed
					</Text>

					<StyledButton
						label="Start Accepting Orders"
						onClick={props.openToggleStoreOpenModal}
					/>
				</Stack>
			)}
		</>
	);
}

export default Orders;
