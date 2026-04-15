import { useState } from "react";
import { notifications } from "@mantine/notifications";

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

import { useAppDispatch, useAppSelector } from "../../state/hooks";

import { selectMenu } from "../../state/menu/menuSlice";
import { selectAllIngredients } from "../../state/modifiers/modifiersSlice";

import { upsertMenuItems } from "../../state/menuItems/menuItemsThunks";
import { upsertModifiers } from "../../state/modifiers/modifierThunks";

interface UpdateStockDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function UpdateStockDrawer(props: UpdateStockDrawerProps) {
  const { isOpen, onClose } = props;

  // store data
  const dispatch = useAppDispatch();
  const menu = useAppSelector(selectMenu);
  const ingredients = useAppSelector(selectAllIngredients);
  const menuItems = menu.flatMap((menuSection) => menuSection.items);

  // existing stock
  const existingOutOfStockIngredients = ingredients.filter(
    (ingredient) => !ingredient.is_in_stock,
  );
  const existingOutOfStockMenuItems = menuItems.filter(
    (item) => !item.is_in_stock,
  );
  const existingInStockMenuItems = menuItems.filter((item) => item.is_in_stock);

  // menu view state toggled between Checkbox List / Multiselect
  const [menuView, setMenuView] = useState("Checkbox List");

  // loading state
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  // edited stock state
  const [outOfStockIngredients, setOutOfStockIngredients] = useState(
    existingOutOfStockIngredients,
  );
  const [outOfStockMenuItems, setOutOfStockMenuItems] = useState(
    existingOutOfStockMenuItems,
  );
  const [inStockMenuItems, setInStockMenuItems] = useState(
    existingInStockMenuItems,
  );

  const onSelectOutOfStockIngredients = (values: string[]) => {
    setOutOfStockIngredients(
      ingredients.filter(({ id }) => values.find((value) => value === id)),
    );
  };

  const onSelectOutOfStockMenuItems = (values: string[]) => {
    setOutOfStockMenuItems(
      menuItems.filter(({ id }) => values.find((value) => value === id)),
    );
    setInStockMenuItems(
      menuItems.filter(({ id }) => !values.find((value) => value === id)),
    );
  };

  const onSelectInStockMenuItems = (values: string[]) => {
    setInStockMenuItems(
      menuItems.filter(({ id }) => values.find((value) => value === id)),
    );
    setOutOfStockMenuItems(
      menuItems.filter(({ id }) => !values.find((value) => value === id)),
    );
  };

  const onCancel = () => {
    setOutOfStockIngredients(existingOutOfStockIngredients);
    setInStockMenuItems(existingInStockMenuItems);
    setOutOfStockMenuItems(existingOutOfStockMenuItems);
    onClose();
  };

  const onUpdateStock = () => {
    setIsUpdatingStock(true);

    if (
      JSON.stringify(outOfStockIngredients) !==
      JSON.stringify(existingOutOfStockIngredients)
    ) {
      const newlyOutOfStockIngredients = outOfStockIngredients
        .filter(
          (ingredient) => !existingOutOfStockIngredients.includes(ingredient),
        )
        .map((ingredient) => ({ ...ingredient, is_in_stock: false }));

      const nowInStockIngredients = existingOutOfStockIngredients
        .filter((ingredient) => !outOfStockIngredients.includes(ingredient))
        .map((ingredient) => ({ ...ingredient, is_in_stock: true }));

      const ingredientsToUpdate = [
        ...newlyOutOfStockIngredients,
        ...nowInStockIngredients,
      ];

      dispatch(upsertModifiers(ingredientsToUpdate))
        .catch((error) =>
          notifications.show({
            message: error,
            withCloseButton: false,
            position: "bottom-right",
            color: "red",
          }),
        )
        .finally(() => setIsUpdatingStock(false));

      notifications.show({
        withCloseButton: false,
        message: "Ingredients stock updated successfully",
        position: "bottom-right",
        color: "green",
      });
      onClose();
    }

    if (
      JSON.stringify(outOfStockMenuItems) !==
      JSON.stringify(existingOutOfStockMenuItems)
    ) {
      const newlyOutOfStockMenuItems = outOfStockMenuItems
        .filter((item) => !existingOutOfStockMenuItems.includes(item))
        .map((menuItem) => ({ ...menuItem, is_in_stock: false }));

      const nowInStockMenuItems = existingOutOfStockMenuItems
        .filter((item) => !outOfStockMenuItems.includes(item))
        .map((menuItem) => ({ ...menuItem, is_in_stock: true }));

      const menuItemsToUpdate = [
        ...newlyOutOfStockMenuItems,
        ...nowInStockMenuItems,
      ];

      dispatch(upsertMenuItems(menuItemsToUpdate))
        .catch((error) =>
          notifications.show({
            message: error,
            withCloseButton: false,
            position: "bottom-right",
            color: "red",
          }),
        )
        .finally(() => setIsUpdatingStock(false));

      notifications.show({
        withCloseButton: false,
        message: "Order times successfully updated",
        position: "bottom-right",
        color: "green",
      });
      onClose();
    }
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
          label="Select out of stock ingredients"
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

          {menuView === "Checkbox List" && (
            <>
              <Text>Toggle off out of stock menu items</Text>

              {menu.map((section, index) => (
                <>
                  {index > 0 && <Divider />}
                  <Checkbox.Group
                    key={section.id}
                    label={section.label}
                    value={inStockMenuItems.map(({ id }) => id)}
                    onChange={onSelectInStockMenuItems}
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
            </>
          )}

          {menuView === "Multiselect" && (
            <>
              <Text>Select out of stock menu items</Text>

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
            </>
          )}
        </Stack>

        <Group gap="sm">
          <StyledButton variant="outline" label="Cancel" onClick={onCancel} />
          <StyledButton
            label="Confirm"
            onClick={onUpdateStock}
            isLoading={isUpdatingStock}
          />
        </Group>
      </Stack>
    </Drawer>
  );
}

export default UpdateStockDrawer;
