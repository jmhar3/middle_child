import { useEffect, useMemo, useState } from "react";
import { em, Box, Text, Stack, Divider, Accordion } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { v4 as uuid } from "uuid";

import banner from "/assets/cafe-counter.jpeg";

import PageLayout from "./PageLayout";
import Loading from "../../components/Loading";
import CartModal from "../../components/customer/CartModal";
import MenuItemModal from "../../components/MenuItemModal";
import MenuItemButton from "../../components/customer/MenuItemButton";
import ButtonWithPrice from "../../components/customer/ButtonWithPrice";

import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { fetchMenu } from "../../state/menu/menuThunks";
import { fetchStoreInfo } from "../../state/storeInfo/storeInfoThunks";
import { selectMenu, selectMenuStatus } from "../../state/menu/menuSlice";
import { fetchUser } from "../../state/user/userThunks";

import {
	selectStoreInfo,
	selectStoreInfoStatus,
	selectStoreIsOpen,
} from "../../state/storeInfo/storeInfoSlice";

import {
	selectRecentlyOrderedItems,
	selectUserLoyaltyPoints,
	selectUserStatus,
} from "../../state/user/userSlice";

import { calculateOrderItemPrice, filterItemFromOrder } from "../../helpers";

import type { MenuItemType, OrderItem, OrderType } from "../../state/types";
import PlacedOrderModal from "../../components/customer/PlacedOrderModal";

function Menu() {
	const dispatch = useAppDispatch();
	const menuStatus = useAppSelector(selectMenuStatus);
	const menu = useAppSelector(selectMenu);
	const storeInfoStatus = useAppSelector(selectStoreInfoStatus);
	const storeInfo = useAppSelector(selectStoreInfo);
	const storeIsOpen = useAppSelector(selectStoreIsOpen);
	const userStatus = useAppSelector(selectUserStatus);
	const recentlyOrderedItems = useAppSelector(selectRecentlyOrderedItems);
	const loyaltyPoints = useAppSelector(selectUserLoyaltyPoints);

	const isLoading =
		menuStatus === "pending" ||
		storeInfoStatus === "pending" ||
		userStatus === "pending";

	useEffect(() => {
		if (menuStatus === "idle") {
			dispatch(fetchMenu());
		}
		if (storeInfoStatus === "idle") {
			dispatch(fetchStoreInfo());
		}
		if (userStatus === "idle") {
			dispatch(fetchUser());
		}
	}, [dispatch, menuStatus, storeInfoStatus, userStatus]);

	const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

	const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
	const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(
		null,
	);
	const [orderItems, setOrderItems] = useState<OrderItem[] | null>(null);
	const [isCartModalOpen, setIsCartModalOpen] = useState(false);
	const [showPlacedOrder, setShowPlacedOrder] = useState(false);
	const [placedOrder, setPlacedOrder] = useState<OrderType | null>(null);

	const pointsRemaining = useMemo(() => {
		const additionalLoyaltyPoints = orderItems
			?.filter((item) => item.item.is_applicable_loyalty_item)
			.map(({ quantity }) => quantity)
			.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

		if (loyaltyPoints === undefined || loyaltyPoints === 0) {
			if (
				additionalLoyaltyPoints === undefined ||
				additionalLoyaltyPoints === 0
			) {
				return null;
			}
			return 12 - additionalLoyaltyPoints;
		}

		if (
			additionalLoyaltyPoints === undefined ||
			additionalLoyaltyPoints === 0
		) {
			return 12 - loyaltyPoints;
		}

		return 12 - loyaltyPoints - additionalLoyaltyPoints;
	}, [orderItems, loyaltyPoints]);

	const totalItemsInOrder = useMemo(
		() =>
			orderItems?.reduce((accumulator, currentItem) => {
				return accumulator + currentItem.quantity;
			}, 0),
		[orderItems],
	);

	const orderTotal = useMemo(() => {
		return orderItems
			?.map(
				(item) =>
					calculateOrderItemPrice(item.item, item.modifiers) * item.quantity,
			)
			.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
	}, [orderItems]);

	const handleOpenMenuItemModal = (menuItem: MenuItemType) => {
		setSelectedMenuItem(menuItem);
		setIsMenuItemModalOpen(true);
	};

	const addItemToOrder = (item: OrderItem) => {
		setOrderItems((items) => {
			if (items) {
				const existingOrderItem = items.find((existingItem) => {
					const existingModifiersIds =
						existingItem.modifiers?.map((m) => m.id) || [];
					const itemModifiersIds = item.modifiers?.map((m) => m.id) || [];
					const matchingModifiers =
						existingModifiersIds.length === itemModifiersIds.length &&
						existingModifiersIds.every(
							(val, index) => val === itemModifiersIds[index],
						);

					const matchingItemId = existingItem.item.id === item.item.id;
					const matchingNote =
						(existingItem.note === null || existingItem.note === undefined) &&
						(item.note === null || item.note === undefined);

					return matchingItemId && matchingModifiers && matchingNote;
				});

				const filteredOrderItems =
					existingOrderItem && filterItemFromOrder(items, existingOrderItem);

				if (existingOrderItem && filteredOrderItems) {
					const newOrderItems = [
						...filteredOrderItems,
						{
							...existingOrderItem,
							quantity: existingOrderItem.quantity + item.quantity,
						},
					];

					return existingOrderItem && filteredOrderItems
						? newOrderItems
						: [...items, item];
				}

				return [...items, item];
			}

			return [item];
		});

		setIsMenuItemModalOpen(false);
	};

	const onEditOrderItem = (
		oldOrderItem: OrderItem,
		newOrderItem: OrderItem,
	) => {
		setOrderItems((items) => {
			if (items) {
				const filteredOrderItems = filterItemFromOrder(items, oldOrderItem);

				return [...filteredOrderItems, newOrderItem];
			} else {
				return null;
			}
		});

		setIsMenuItemModalOpen(false);
	};

	const onDeleteOrderItem = (orderItem: OrderItem) => {
		setOrderItems((items) => {
			if (items) {
				const filteredOrderItems = filterItemFromOrder(items, orderItem);
				if (filteredOrderItems.length === 0) setIsCartModalOpen(false);
				return filteredOrderItems;
			}
			return null;
		});
	};

	const onMenuItemClick = (menuItem: MenuItemType) => {
		if (
			menuItem.description ||
			menuItem.image ||
			menuItem.modifiers ||
			menuItem.modifierCategories
		) {
			handleOpenMenuItemModal(menuItem);
		} else {
			addItemToOrder({
				id: uuid(),
				quantity: 1,
				item: menuItem,
			});
		}
	};

	const onOrderSuccess = (order: OrderType) => {
		setShowPlacedOrder(true);
		setPlacedOrder(order);
		setOrderItems(null);
	};

	if (isLoading) return <Loading message="Loading store data" />;

	return (
		<PageLayout image={banner}>
			{orderItems &&
				orderItems.length > 0 &&
				orderTotal &&
				!isCartModalOpen &&
				!showPlacedOrder &&
				!isMenuItemModalOpen && (
					<Box
						w="100%"
						pos="fixed"
						px={isMobile ? "sm" : "lg"}
						bottom={isMobile ? "20px" : "11px"}
						style={{ zIndex: 9999 }}
					>
						<ButtonWithPrice
							onClick={() => setIsCartModalOpen(true)}
							label={`Review Order ${orderItems && `( ${totalItemsInOrder} )`}`}
							price={orderTotal}
						/>
					</Box>
				)}

			<Stack w="100%" p="xs" pb="sm" gap="xs" align="center">
				{storeIsOpen ? (
					<Text>
						Pick up time from {storeInfo.current_order_time.short} minutes
					</Text>
				) : (
					<>
						<Text>Sorry, we're closed.</Text>
						<Text>Our brewing hours are:</Text>
						<Text>Mon - Fri 7:30am - 1pm</Text>
						<Text>Sat - Sun 7:30am - 2pm</Text>
					</>
				)}

				{pointsRemaining !== null ? (
					<>
						<Divider w="100%" />

						{pointsRemaining > 0 ? (
							<Text>You're {pointsRemaining} coffees away from a freebie!</Text>
						) : (
							<Text>You've unlocked a free coffee!</Text>
						)}
					</>
				) : (
					<Text>Start drinking to earn points!</Text>
				)}
			</Stack>

			<Divider w="100%" />

			<Stack w="100%" pb="60">
				<Accordion
					styles={{
						item: { borderColor: "darkslategray" },
						content: {
							padding: 0,
							margin: 0,
							backgroundColor: "white",
						},
						control: {
							backgroundColor: "whitesmoke",
						},
					}}
				>
					{recentlyOrderedItems && (
						<Accordion.Item key="recently-ordered" value="recently-ordered">
							<Accordion.Control>
								<Text component="span">RECENTLY ORDERED</Text>
							</Accordion.Control>
							<Accordion.Panel>
								<Stack gap="3">
									{recentlyOrderedItems?.map((orderItem, index) => (
										<>
											{index !== 0 && <Divider />}
											<MenuItemButton
												key={orderItem.item.label}
												isPrevOrder={true}
												note={orderItem.note}
												onClick={() => addItemToOrder(orderItem)}
												{...orderItem}
											/>
										</>
									))}
								</Stack>
							</Accordion.Panel>
						</Accordion.Item>
					)}

					{menu.map((section) => (
						<Accordion.Item key={section.label} value={section.label}>
							<Accordion.Control disabled={!section.is_in_stock}>
								<Text component="span">{section.label.toUpperCase()}</Text>
							</Accordion.Control>
							<Accordion.Panel>
								<Stack gap="0">
									{section.items.map((menuItem, index) => (
										<>
											{index !== 0 && <Divider />}
											<MenuItemButton
												key={menuItem.label}
												item={menuItem}
												onClick={() => onMenuItemClick(menuItem)}
											/>
										</>
									))}
								</Stack>
							</Accordion.Panel>
						</Accordion.Item>
					))}
				</Accordion>
			</Stack>

			{selectedMenuItem && (
				<MenuItemModal
					isOpen={isMenuItemModalOpen}
					onClose={() => {
						setSelectedMenuItem(null);
						setIsMenuItemModalOpen(false);
					}}
					menuItem={selectedMenuItem}
					onAddToOrder={addItemToOrder}
				/>
			)}

			{orderItems && orderItems.length > 0 && (
				<CartModal
					items={orderItems}
					isOpen={isCartModalOpen}
					onClose={() => setIsCartModalOpen(false)}
					onEditOrderItem={onEditOrderItem}
					onDeleteOrderItem={onDeleteOrderItem}
					onSuccess={onOrderSuccess}
				/>
			)}

			{placedOrder && (
				<PlacedOrderModal
					order={placedOrder}
					isOpen={showPlacedOrder}
					onClose={() => setShowPlacedOrder(false)}
				/>
			)}
		</PageLayout>
	);
}

export default Menu;
