import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Flex, Text, Stack, Badge } from "@mantine/core";

import type { OrderItem as OrderItemType } from "../../../state/types";

dayjs.extend(relativeTime);

interface OrderItemProps {
  item: OrderItemType;
}

function OrderItem({ item: orderItem }: OrderItemProps) {
  const { id, quantity, item: menuItem, modifiers, note } = orderItem;

  const code = modifiers
    ? modifiers.map(({ reference_code }) => reference_code).join("") +
      menuItem.reference_code
    : menuItem.reference_code;

  return (
    <Flex key={id} gap="sm" justify="space-between">
      <Stack gap="0">
        <Text>
          {quantity} x{" "}
          {menuItem.reference_code
            ? `${code} | ${menuItem.label}`
            : menuItem.label}
        </Text>
        <Text fs="italic">{note}</Text>
      </Stack>
      {modifiers && (
        <Flex gap="sm">
          {modifiers.map((modifier) => (
            <Badge
              radius="sm"
              size="lg"
              color="darkslategray"
              key={modifier.id}
            >
              {modifier.label}
            </Badge>
          ))}
        </Flex>
      )}
    </Flex>
  );
}

export default OrderItem;
