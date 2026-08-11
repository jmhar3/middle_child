import { useEffect, useMemo, useState } from "react";
import { Box, Button, Divider, Modal, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useCounter } from "@mantine/hooks";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

import ButtonWithPrice from "./ButtonWithPrice";
import PaymentHandler from "./PaymentHandler";
import LoyaltyPoints from "./LoyaltyPoints";
import MenuItemModal from "../MenuItemModal";
import NoteInput from "./NoteInput";
import CartItem from "./CartItem";

import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { fetchUser, updateUser } from "../../state/user/userThunks";
import { selectStoreInfo } from "../../state/storeInfo/storeInfoSlice";
import { placeOrder } from "../../state/orders/ordersThunks";

import {
	selectUser,
	selectUserStatus,
	selectUserLoyaltyPoints,
} from "../../state/user/userSlice";

import { calculateOrderItemPrice, formatPrice } from "../../helpers";

import type {
	OrderItem,
	PlacedOrderType,
	PendingOrderType,
	User,
} from "../../state/types";

interface CartModalProps {
	items: OrderItem[];
	isOpen: boolean;
	onClose: () => void;
	onEditOrderItem: (oldOrderItem: OrderItem, newOrderItem: OrderItem) => void;
	onDeleteOrderItem: (orderItem: OrderItem) => void;
	onSuccess: (order: PlacedOrderType) => void;
}

function CartModal(props: CartModalProps) {
	const {
		items,
		isOpen,
		onClose,
		onSuccess,
		onEditOrderItem,
		onDeleteOrderItem,
	} = props;

	const dispatch = useAppDispatch();
	const userStatus = useAppSelector(selectUserStatus);
	const user = useAppSelector(selectUser);
	const loyaltyPoints = useAppSelector(selectUserLoyaltyPoints);
	const storeInfo = useAppSelector(selectStoreInfo);

	useEffect(() => {
		if (userStatus === "idle") {
			dispatch(fetchUser());
		}
	}, [dispatch, userStatus]);

	const [note, setNote] = useState<string | undefined>();
	const [oldOrderItem, setOldOrderItem] = useState<OrderItem | undefined>();
	const [showMenuItemModal, setShowMenuItemModal] = useState(false);
	const [isPlacingOrder, setIsPlacingOrder] = useState(false);
	const [showPaymentHandler, setShowPaymentHandler] = useState(false);

	const applicableLoyaltyItems = useMemo(() => {
		return items.filter((item) => item.item.is_applicable_loyalty_item);
	}, [items]);

	const additionalLoyaltyPoints = useMemo(() => {
		return applicableLoyaltyItems
			.map(({ quantity }) => quantity)
			.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
	}, [applicableLoyaltyItems]);

	const pointsTotal = (loyaltyPoints || 0) + additionalLoyaltyPoints;

	const freeItem = useMemo(() => {
		if (storeInfo?.loyalty_points && pointsTotal >= storeInfo.loyalty_points) {
			let quantity = loyaltyPoints || 0;
			for (const item of applicableLoyaltyItems) {
				if (quantity + item.quantity >= storeInfo?.loyalty_points) {
					return item;
				}
				quantity += item.quantity;
			}
		}
		return null;
	}, [storeInfo, pointsTotal, loyaltyPoints, applicableLoyaltyItems]);

	const orderTotal = useMemo(() => {
		return items
			.map((item) => {
				if (freeItem?.id === item.id) {
					if (item.quantity === 1) return 0;
					return (
						calculateOrderItemPrice(item.item, item.modifiers, item.is_large) *
						(item.quantity - 1)
					);
				}
				return (
					calculateOrderItemPrice(item.item, item.modifiers, item.is_large) *
					item.quantity
				);
			})
			.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
	}, [items, freeItem]);

	const pickUpTimeFromNow = useMemo(() => {
		const hasLongPrepTime = items.find(
			(orderItem) => orderItem.item.has_long_prep_time || false,
		);

		const numOfItems = items
			.map(({ quantity }) => quantity)
			.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

		if (hasLongPrepTime || numOfItems > 5) {
			return storeInfo?.current_order_time.long || 20;
		} else {
			return storeInfo?.current_order_time.short || 10;
		}
	}, [items, storeInfo]);

	const [pickUpTime, { increment, decrement, reset }] = useCounter(
		pickUpTimeFromNow,
		{ min: pickUpTimeFromNow },
	);

	if (pickUpTimeFromNow > pickUpTime) increment();

	const order: PendingOrderType = {
		items: items,
		total: orderTotal,
		due_at: dayjs().add(pickUpTime, "minute").toISOString(),
		is_complete: false,
	};

	const formattedPrice = formatPrice(order.total);

	const onModalClose = () => {
		reset();
		onClose();
	};

	const finaliseOrder = (user: User) => {
		dispatch(
			updateUser({
				id: user.id,
				loyalty_points:
					storeInfo?.loyalty_points && freeItem
						? pointsTotal - storeInfo?.loyalty_points
						: pointsTotal,
			}),
		)
			.then(() => {
				onSuccess({ ...order, id: "temp-order-id", user: user });
				onClose();
			})
			.catch((error) =>
				notifications.show({
					message: error,
					withCloseButton: false,
					position: "bottom-right",
					color: "red",
				}),
			)
			.finally(() => {
				setShowPaymentHandler(false);
				setIsPlacingOrder(false);
			});
	};

	const onPlaceOrder = async () => {
		setIsPlacingOrder(true);

		if (!user) {
			setIsPlacingOrder(false);
			return;
		}

		const isFreeOrder = order.total === 0;

		if (isFreeOrder) {
			dispatch(
				placeOrder({
					userId: user.id,
					orderData: order,
				}),
			)
				.then(() => {
					finaliseOrder(user);
				})
				.catch((error) =>
					notifications.show({
						message: error,
						withCloseButton: false,
						position: "bottom-right",
						color: "red",
					}),
				);
		} else {
			setShowPaymentHandler(true);
		}
	};

	return (
		<>
			{oldOrderItem && (
				<MenuItemModal
					isOpen={showMenuItemModal}
					onClose={() => {
						setOldOrderItem(undefined);
						setShowMenuItemModal(false);
					}}
					menuItem={oldOrderItem.item}
					orderItem={oldOrderItem}
					onAddToOrder={(newOrderItem: OrderItem) =>
						onEditOrderItem(oldOrderItem, newOrderItem)
					}
				/>
			)}

			{user && showPaymentHandler && (
				<PaymentHandler
					userId={user.id}
					order={order}
					isOpen={showPaymentHandler}
					onClose={() => {
						setShowPaymentHandler(false);
						setIsPlacingOrder(false);
					}}
					onSuccess={() => {
						finaliseOrder(user);
					}}
					onFailure={(error) => {
						console.error(error);
						notifications.show({
							message: "An error occured. Please try again or come in store.",
							withCloseButton: false,
							position: "bottom-right",
							color: "red",
						});
						setShowPaymentHandler(false);
						setIsPlacingOrder(false);
					}}
				/>
			)}

			<Modal
				fullScreen
				radius={0}
				title="CART"
				opened={isOpen}
				onClose={onModalClose}
				transitionProps={{ transition: "fade", duration: 200 }}
				styles={{
					header: { background: "whitesmoke" },
					content: { background: "whitesmoke" },
				}}
			>
				<Stack mih="100%" align="center">
					<Box
						p="sm"
						w="100%"
						bdrs="sm"
						bg="white"
						bd="lightslategray solid 1px"
					>
						<LoyaltyPoints additionalPoints={additionalLoyaltyPoints} />
					</Box>

					<Stack w="100%">
						{!items && <Text>Your cart is empty.</Text>}
						{items?.map((orderItem, index) => (
							<>
								{index === 0 && <Divider />}
								<CartItem
									isFreeItem={orderItem.id === freeItem?.id}
									orderItem={orderItem}
									onDeleteClick={() => onDeleteOrderItem(orderItem)}
									onEditClick={() => {
										setOldOrderItem(orderItem);
										setShowMenuItemModal(true);
									}}
								/>
								<Divider />
							</>
						))}
					</Stack>

					<NoteInput label="Notes" note={note} setNote={setNote} />

					<Button.Group>
						<Button
							radius="md"
							variant="filled"
							color="darkslategray"
							onClick={decrement}
							disabled={pickUpTime === pickUpTimeFromNow}
						>
							-
						</Button>
						<Button.GroupSection
							bg="white"
							color="darkslategray"
							variant="outline"
						>
							Pick Up in {pickUpTime} Minutes
						</Button.GroupSection>
						<Button
							radius="md"
							variant="filled"
							color="darkslategray"
							onClick={increment}
						>
							+
						</Button>
					</Button.Group>

					<Stack gap="xs" w="100%" align="center">
						<ButtonWithPrice
							isLoading={isPlacingOrder}
							onClick={onPlaceOrder}
							isDisabled={!user}
							label={user ? "Order Now" : "Login to Place Order"}
							price={formattedPrice}
						/>
						<Text>Pay securely using Square</Text>
					</Stack>
				</Stack>
			</Modal>
		</>
	);
}

export default CartModal;
