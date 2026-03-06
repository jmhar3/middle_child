import { useState } from "react";

import {
  Text,
  Group,
  Stack,
  Drawer,
  Divider,
  Checkbox,
  MultiSelect,
  SegmentedControl,
} from "@mantine/core";

import StyledButton from "../StyledButton";

import { selectMenu } from "../../state/menu/menuSlice";
import { selectAllIngredients } from "../../state/modifiers/modifiersSlice";
import { useAppSelector } from "../../state/hooks";

import type { Modifier } from "../../state/modifiers/modifiersSlice";

// to be removed
import type { MenuItemType } from "../../types/menu";

interface UpdateStockDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStock: () => void;
}

function UpdateStockDrawer(props: UpdateStockDrawerProps) {
  const { isOpen, onClose, onUpdateStock } = props;

  const menu = useAppSelector(selectMenu);
  const ingredients = useAppSelector(selectAllIngredients);

  const menuItems = menu.flatMap((menuSection) => menuSection.items);

  const [menuView, setMenuView] = useState("Checkbox List");

  const [outOfStockIngredients, setOutOfStockIngredients] = useState<
    Modifier[]
  >(ingredients.filter((ingredient) => !ingredient.is_in_stock));
  const [outOfStockMenuItems, setOutOfStockMenuItems] = useState<
    MenuItemType[]
  >(menuItems.filter((item) => !item.is_in_stock));

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

  return (
    <Drawer
      offset={12}
      radius="sm"
      position="right"
      opened={isOpen}
      onClose={onClose}
      withCloseButton={false}
      trapFocus={false}
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
          value={outOfStockIngredients?.map(({ id }) => id)}
          onChange={onSelectOutOfStockIngredients}
          data={ingredients?.map((ingredient) => ({
            value: ingredient.id,
            label: ingredient.label,
          }))}
          hidePickedOptions
          searchable
        />

        <Stack w="100%" gap="xs" bd="solid 1px lightgray" bdrs="sm" p="sm">
          <Stack gap="0">
            <Text>Menu Items</Text>

            <SegmentedControl
              w="100%"
              value={menuView}
              onChange={setMenuView}
              data={["Multiselect", "Checkbox List"]}
            />
          </Stack>

          {menuView === "Checkbox List" &&
            menu.map((section, index) => (
              <>
                {index > 0 && <Divider />}
                <Checkbox.Group
                  key={section.id}
                  label={section.label}
                  value={outOfStockMenuItems.map(({ id }) => id)}
                  onChange={onSelectOutOfStockMenuItems}
                >
                  <Group mt="xs">
                    {section.items.map((item) => (
                      <Checkbox
                        key={item.id}
                        value={item.id}
                        label={item.label}
                      />
                    ))}
                  </Group>
                </Checkbox.Group>
              </>
            ))}

          {menuView === "Multiselect" && (
            <MultiSelect
              w="100%"
              size="md"
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
          )}
        </Stack>

        <Group gap="sm">
          <StyledButton variant="outline" label="Cancel" onClick={onClose} />
          <StyledButton label="Confirm" onClick={onUpdateStock} />
        </Group>
      </Stack>
    </Drawer>
  );
}

export default UpdateStockDrawer;
