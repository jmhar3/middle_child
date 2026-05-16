import { Button, em, ScrollArea, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { calculateOrderItemPrice } from "../../helpers";

import type { MenuItemType, Modifier } from "../../state/types";

interface MenuItemButtonProps {
  onClick: () => void;
  item: MenuItemType;
  modifiers?: Modifier[];
}

function MenuItemButton(props: MenuItemButtonProps) {
  const { onClick, item, modifiers } = props;

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const totalPrice = modifiers
    ? calculateOrderItemPrice(item, modifiers)
    : item.price;

  return (
    <Button
      px="lg"
      fullWidth
      radius="0"
      h="fit-content"
      variant="transparent"
      color="darkslategray"
      justify="space-between"
      disabled={!item.is_in_stock}
      size={isMobile ? "sm" : "lg"}
      rightSection={<Text fw={700}>${totalPrice}</Text>}
      onClick={onClick}
    >
      <Stack gap="0" w="100%" justify="center" align="flex-start" py="xs">
        <Text fw={700}>{item.label}</Text>
        <Text>{item.description}</Text>

        {modifiers && modifiers.length > 0 && (
          <ScrollArea h="20px" w="100%">
            <Text size="xs">
              {modifiers.map((ingredient) => ingredient.label).join(", ")}
            </Text>
          </ScrollArea>
        )}
      </Stack>
    </Button>
  );
}

export default MenuItemButton;
