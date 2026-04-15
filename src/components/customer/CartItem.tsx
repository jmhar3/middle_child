import { Text, Flex, Stack, ScrollArea, ActionIcon } from "@mantine/core";

import { calculateOrderItemPrice } from "../../helpers";

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

  const orderItemPrice = calculateOrderItemPrice(item, modifiers);

  return (
    <Stack gap="3">
      <Flex key={item.label} justify="space-between" align="center">
        <Text>
          {quantity} x {item.label}
        </Text>

        <Flex align="center" gap="sm">
          <Text>${(orderItemPrice * quantity).toFixed(2)}</Text>

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
      {modifiers?.length > 0 && (
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
