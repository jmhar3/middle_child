import {
  Divider,
  Drawer,
  Group,
  MultiSelect,
  Stack,
  Text,
} from "@mantine/core";

import StyledButton from "../StyledButton";

import { ingredients, menu, type Modifier } from "../../helpers/menu";
import { useState } from "react";

interface UpdateStockDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStock: () => void;
}

function UpdateStockDrawer(props: UpdateStockDrawerProps) {
  const { isOpen, onClose, onUpdateStock } = props;

  const menuItems = menu.flatMap((menuSection) => menuSection.items);

  const [outOfStockIngredients, setOutOfStockIngredients] = useState<
    Modifier[]
  >(ingredients.slice(0, 2));
  const [outOfStockMenuItems, setOutOfStockMenuItems] = useState<Modifier[]>(
    menuItems.slice(0, 3),
  );

  const onSelectOutOfStockIngredients = (values: string[]) => {
    setOutOfStockIngredients(
      values
        .map((value) => ingredients.find(({ id }) => id === value))
        .filter((ingredient) => ingredient !== undefined),
    );
  };

  const onSelectOutOfStockMenuItems = (values: string[]) => {
    setOutOfStockMenuItems(
      values
        .map((value) => menuItems.find(({ id }) => id === value))
        .filter((item) => item !== undefined),
    );
  };

  console.log(outOfStockIngredients);

  return (
    <Drawer
      offset={12}
      radius="sm"
      position="right"
      opened={isOpen}
      onClose={onClose}
      withCloseButton={false}
    >
      <Stack align="flex-end">
        <Text size="1.4em" fw="600" ta="left" w="100%">
          UPDATE STOCK
        </Text>

        <Divider w="100%" />

        <MultiSelect
          w="100%"
          size="md"
          label="Ingredients"
          placeholder="Select out of stock ingredients"
          nothingFoundMessage="No ingredients found matching your search"
          value={outOfStockIngredients.map(({ id }) => id)}
          onChange={onSelectOutOfStockIngredients}
          data={ingredients.map((ingredient) => ({
            value: ingredient.id,
            label: ingredient.label,
          }))}
          hidePickedOptions
          searchable
        />

        <MultiSelect
          w="100%"
          size="md"
          label="Menu Items"
          placeholder="Select out of stock menu items"
          nothingFoundMessage="No menu items found matching your search"
          value={outOfStockMenuItems.map(({ id }) => id)}
          onChange={onSelectOutOfStockMenuItems}
          data={menuItems.map((item) => ({
            value: item.id,
            label: item.label,
          }))}
          hidePickedOptions
          searchable
        />

        <Divider w="100%" />

        <Group gap="sm">
          <StyledButton variant="outline" label="Cancel" onClick={onClose} />
          <StyledButton label="Confirm" onClick={onUpdateStock} />
        </Group>
      </Stack>
    </Drawer>
  );
}

export default UpdateStockDrawer;
