import { Text, Flex, Stack, ScrollArea, ActionIcon } from "@mantine/core";

import { calculateOrderItemPrice, type OrderItem } from "../../helpers/cart";
import EditIcon from "../../icons/EditIcon";
import CloseIcon from "../../icons/CloseIcon";

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
  const { modifiers, menuItem, quantity } = orderItem;

  const orderItemPrice = calculateOrderItemPrice(menuItem, modifiers);

  return (
    <Stack gap="3">
      <Flex key={menuItem.label} justify="space-between" align="center">
        <Text>
          {quantity} x {menuItem.label}
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
    </Stack>
  );
}

export default CartItem;
