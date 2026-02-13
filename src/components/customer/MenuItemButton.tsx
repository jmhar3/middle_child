import { Button, em, ScrollArea, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { calculateOrderItemPrice } from "../../helpers/cart";

import type { MenuItemType, Modifier } from "../../helpers/menu";

interface MenuItemButtonProps {
  onClick: () => void;
  menuItem: MenuItemType;
  modifiers?: Modifier[];
}

function MenuItemButton(props: MenuItemButtonProps) {
  const { onClick, menuItem, modifiers } = props;

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const totalPrice = modifiers
    ? calculateOrderItemPrice(menuItem, modifiers)
    : menuItem.price;

  return (
    <Button
      px="lg"
      fullWidth
      radius="0"
      h="fit-content"
      variant="transparent"
      color="darkslategray"
      justify="space-between"
      size={isMobile ? "sm" : "lg"}
      rightSection={<Text fw={700}>${totalPrice}</Text>}
      onClick={onClick}
    >
      <Stack gap="3" w="100%" justify="center" align="flex-start" py="xs">
        <Text fw={700}>{menuItem.label}</Text>

        {menuItem.ingredients && (
          <ScrollArea h="20px" w="100%">
            <Text size="xs">
              {menuItem.ingredients
                .map((ingredient) => ingredient.label)
                .join(", ")}
            </Text>
          </ScrollArea>
        )}

        {modifiers && (
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
