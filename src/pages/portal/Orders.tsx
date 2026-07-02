import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

import fartSound from "/assets/fart1.mp3";

import PageLayout from "./PageLayout";
import Loading from "../../components/Loading";
import StyledButton from "../../components/StyledButton";
import OrdersList from "../../components/portal/orders/OrdersList";
import UpdateStockDrawer from "../../components/portal/UpdateStockDrawer";
import ToggleStoreOpenModal from "../../components/portal/orders/ToggleStoreOpenModal";

import { supabase } from "../../supabase";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { fetchMenu } from "../../state/menu/menuThunks";
import { fetchOrders } from "../../state/orders/ordersThunks";
import { fetchModifiers } from "../../state/modifiers/modifierThunks";
import { fetchOrderTimes } from "../../state/orderTimes/orderTimesThunks";
import { selectModifiersStatus } from "../../state/modifiers/modifiersSlice";
import { selectMenuStatus } from "../../state/menu/menuSlice";
import { selectUser, selectUserStatus } from "../../state/user/userSlice";
import { fetchUser } from "../../state/user/userThunks";

import {
	fetchStoreInfo,
	updateStoreInfo,
} from "../../state/storeInfo/storeInfoThunks";

import {
	selectStoreInfo,
	selectStoreIsOpen,
} from "../../state/storeInfo/storeInfoSlice";

import {
	selectAllOrderTimes,
	selectOrderTimesStatus,
} from "../../state/orderTimes/orderTimesSlice";

import {
	selectOrders,
	selectOrdersStatus,
} from "../../state/orders/ordersSlice";

import type { OrderTime } from "../../state/types";

dayjs.extend(isoWeek);

function Orders() {
	const audioNotification = new Audio(fartSound);

	const [isUpdatingOrderTime, setIsUpdatingOrderTime] = useState(false);

	const [
		showUpdateStockDrawer,
		{ open: openUpdateStockDrawer, close: closeUpdateStockDrawer },
	] = useDisclosure(false);
	const [
		showToggleStoreOpenModal,
		{ open: openToggleStoreOpenModal, close: closeToggleStoreOpenModal },
	] = useDisclosure(false);

	const dispatch = useAppDispatch();

	const menuStatus = useAppSelector(selectMenuStatus);
	const modifiersStatus = useAppSelector(selectModifiersStatus);
	const orderTimesStatus = useAppSelector(selectOrderTimesStatus);
	const storeInfoStatus = useAppSelector(selectModifiersStatus);
	const ordersStatus = useAppSelector(selectOrdersStatus);
	const orderTimes = useAppSelector(selectAllOrderTimes);
	const storeInfo = useAppSelector(selectStoreInfo);
	const storeIsOpen = useAppSelector(selectStoreIsOpen);
	const orders = useAppSelector(selectOrders);
	const userStatus = useAppSelector(selectUserStatus);
	const user = useAppSelector(selectUser);

	const isLoading =
		!orders &&
		!storeInfo &&
		(modifiersStatus === "pending" ||
			storeInfoStatus === "pending" ||
			orderTimesStatus === "pending" ||
			menuStatus === "pending" ||
			ordersStatus === "pending" ||
			userStatus === "pending");

	useEffect(() => {
		if (userStatus === "idle") {
			dispatch(fetchUser());
		}
		if (user?.is_admin && menuStatus === "idle") {
			dispatch(fetchMenu());
		}
		if (user?.is_admin && modifiersStatus === "idle") {
			dispatch(fetchModifiers());
		}
		if (user?.is_admin && orderTimesStatus === "idle") {
			dispatch(fetchOrderTimes());
		}
		if (user?.is_admin && storeInfoStatus === "idle") {
			dispatch(fetchStoreInfo());
		}
		if (user?.is_admin && ordersStatus === "idle") {
			dispatch(fetchOrders());
		}

		const setAuth = async () => {
			try {
				await supabase.realtime.setAuth();
			} catch (error) {
				console.error("Failed to set realtime auth", error);
			}
		};

		setAuth();
	}, [
		user,
		dispatch,
		userStatus,
		menuStatus,
		modifiersStatus,
		orderTimesStatus,
		storeInfoStatus,
		ordersStatus,
	]);

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
			(payload) => {
				const order = payload.payload.record;
				console.log(order);
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

	const todaysTotal = todaysOrders.reduce((acc, order) => acc + order.total, 0);

	const weeklyTotal = useMemo(() => {
		const weeksOrders = orders.filter((order) =>
			dayjs(order.due_at).isSame(dayjs(), "isoWeek"),
		);
		return weeksOrders.reduce((acc, order) => acc + order.total, 0);
	}, [orders]);

	return (
		<PageLayout
			navComponents={
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
					<StyledButton
						variant="outline"
						label="Update Stock"
						onClick={openUpdateStockDrawer}
					/>

					{storeIsOpen && (
						<StyledButton
							variant="outline"
							label="Close Store"
							onClick={openToggleStoreOpenModal}
						/>
					)}
				</>
			}
		>
			{isLoading && <Loading message="Loading orders" />}

			<UpdateStockDrawer
				isOpen={showUpdateStockDrawer}
				onClose={closeUpdateStockDrawer}
			/>

			{storeInfo && (
				<ToggleStoreOpenModal
					isOpen={showToggleStoreOpenModal}
					onClose={closeToggleStoreOpenModal}
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
				todaysOrders.length > 0 && <OrdersList orders={todaysOrders} />
			) : (
				<Stack align="center" gap="sm" pt="3em">
					<Text ta="center" mb="sm" size="1.6em" fw="600">
						Middle Child is currently closed
					</Text>
					<StyledButton
						label="Start Accepting Orders"
						onClick={openToggleStoreOpenModal}
					/>
				</Stack>
			)}
		</PageLayout>
	);
}

export default Orders;

// const ProtectedPortal = withAuthenticationRequired(Orders);

// export default ProtectedPortal;
