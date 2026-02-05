import { Button, em, ScrollArea, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import type { MenuItemType } from "../../helpers/menu";

interface MenuItemButtonProps {
  onClick: () => void;
  menuItem: MenuItemType;
}

function MenuItemButton(props: MenuItemButtonProps) {
  const { onClick, menuItem } = props;

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <Button
      px="lg"
      fullWidth
      h="fit-content"
      color="#3f5561"
      variant="transparent"
      justify="space-between"
      size={isMobile ? "md" : "lg"}
      rightSection={<Text fw={700}>${menuItem.price}</Text>}
      onClick={onClick}
    >
      <Stack
        gap="3"
        w="100%"
        justify="center"
        align="flex-start"
        py={menuItem.ingredients ? "sm" : "sm"}
      >
        <Text fw={700}>{menuItem.label}</Text>

        {menuItem.ingredients && (
          <ScrollArea h="20px" w="100%">
            <Text size="xs">
              {menuItem.ingredients
                ?.map((ingredient) => ingredient.label)
                .join(", ")}
            </Text>
          </ScrollArea>
        )}
      </Stack>
    </Button>
  );
}

export default MenuItemButton;
