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

  const modifierCodes = modifiers?.map(({ reference_code }) => reference_code);

  const code = modifierCodes
    ? modifierCodes.filter((code) => code !== "Large").join("") +
      menuItem.reference_code
    : menuItem.reference_code;

  return (
    <Flex key={id} gap="sm" justify="space-between">
      <Stack gap="3">
        <Flex gap="sm">
          <Badge radius="sm" size="lg" color="darkslategray">
            {quantity}
          </Badge>
          {menuItem.reference_code ? (
            <Badge
              style={{ letterSpacing: "2px" }}
              radius="sm"
              size="lg"
              color={modifierCodes?.includes("Large") ? "dark" : "purple"}
            >
              {code}
            </Badge>
          ) : (
            <Text>{menuItem.label}</Text>
          )}
        </Flex>

        <Text fs="italic">{note}</Text>
      </Stack>

      <Flex gap="sm" align="center">
        {modifiers && (
          <Flex gap="sm">
            {modifiers.map((modifier) => (
              <Badge
                radius="sm"
                size="xl"
                color="darkslategray"
                key={modifier.id}
              >
                {modifier.label}
              </Badge>
            ))}
          </Flex>
        )}
        <Text>{menuItem.label}</Text>
      </Flex>
    </Flex>
  );
}

export default OrderItem;
