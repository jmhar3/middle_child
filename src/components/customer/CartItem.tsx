import { Text, Flex, Stack, ScrollArea, ActionIcon } from "@mantine/core";

import { calculateOrderItemPrice, formatPrice } from "../../helpers";

import EditIcon from "../../icons/EditIcon";
import CloseIcon from "../../icons/CloseIcon";

import type { OrderItem } from "../../state/types";

interface OrderListItem extends OrderItem {
	quantity: number;
}

interface CartItemProps {
	orderItem: OrderListItem;
	onEditClick: () => void;
	onDeleteClick: () => void;
}

function CartItem(props: CartItemProps) {
	const { orderItem, onEditClick, onDeleteClick } = props;
	const { modifiers, item, quantity, note } = orderItem;

	const discountedItemPrice =
		orderItem.contains_freebie &&
		calculateOrderItemPrice(item, modifiers, orderItem.is_large) *
			(quantity - orderItem.contains_freebie);
	const orderItemPrice =
		calculateOrderItemPrice(item, modifiers, orderItem.is_large) * quantity;
	const formattedPrice = formatPrice(orderItemPrice);

	return (
		<Stack gap="3">
			{orderItem.contains_freebie && (
				<Text fs="italic" c="darkslategray">
					Your 7th coffee is free!
				</Text>
			)}
			<Flex key={item.label} justify="space-between" align="center">
				<Text>
					{quantity} x {orderItem.is_large ? "Large " : ""}
					{item.label}
				</Text>

				<Flex align="center" gap="sm">
					{typeof discountedItemPrice === "number" && (
						<Text>${discountedItemPrice.toFixed(2)}</Text>
					)}
					<Text
						td={
							typeof discountedItemPrice === "number"
								? "line-through"
								: undefined
						}
					>
						{formattedPrice}
					</Text>

					<Flex>
						<ActionIcon
							c="darkslategray"
							variant="transparent"
							aria-label="Edit Order Item"
							onClick={onEditClick}
						>
							<EditIcon />
						</ActionIcon>

						<ActionIcon
							c="darkslategray"
							variant="transparent"
							aria-label="Delete Order Item"
							onClick={onDeleteClick}
						>
							<CloseIcon />
						</ActionIcon>
					</Flex>
				</Flex>
			</Flex>

			{modifiers && (
				<ScrollArea h="20px" w="100%">
					<Text size="xs">
						{modifiers.map((ingredient) => ingredient.label).join(", ")}
					</Text>
				</ScrollArea>
			)}

			{note && <Text fz="xs">Note: {note}</Text>}
		</Stack>
	);
}

export default CartItem;
