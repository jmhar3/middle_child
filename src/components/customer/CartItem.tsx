import { Text, Flex, Stack, ScrollArea, ActionIcon } from "@mantine/core";

import { calculateOrderItemPrice } from "../../helpers";

import EditIcon from "../../icons/EditIcon";
import CloseIcon from "../../icons/CloseIcon";

import type { OrderItem } from "../../state/types";

interface OrderListItem extends OrderItem {
	quantity: number;
}

interface CartItemProps {
	isFreeItem: boolean;
	orderItem: OrderListItem;
	onEditClick: () => void;
	onDeleteClick: () => void;
}

function CartItem(props: CartItemProps) {
	const { isFreeItem, orderItem, onEditClick, onDeleteClick } = props;
	const { modifiers, item, quantity, note } = orderItem;

	const discountedItemPrice =
		isFreeItem && calculateOrderItemPrice(item, modifiers) * (quantity - 1);

	const orderItemPrice = calculateOrderItemPrice(item, modifiers) * quantity;

	return (
		<Stack gap="3">
			{isFreeItem && (
				<Text fs="italic" c="darkslategray">
					Your 13th coffee is free!
				</Text>
			)}
			<Flex key={item.label} justify="space-between" align="center">
				<Text>
					{quantity} x {item.label}
				</Text>

				<Flex align="center" gap="sm">
					{discountedItemPrice && (
						<Text>${discountedItemPrice.toFixed(2)}</Text>
					)}
					<Text td={discountedItemPrice ? "line-through" : undefined}>
						${orderItemPrice.toFixed(2)}
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
