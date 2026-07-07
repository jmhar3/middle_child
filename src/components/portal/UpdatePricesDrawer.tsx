import { useState } from "react";

import {
  Checkbox,
  Divider,
  Drawer,
  Flex,
  Group,
  MultiSelect,
  NumberInput,
  SegmentedControl,
  Stack,
  Text,
} from "@mantine/core";

import StyledButton from "../StyledButton";

import { useAppSelector } from "../../state/hooks";
import { selectMenu } from "../../state/menu/menuSlice";

import type { MenuItemType, MenuSection } from "../../state/types";

interface UpdatePricesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function UpdatePricesDrawer(props: UpdatePricesDrawerProps) {
  const menu: MenuSection[] = useAppSelector(selectMenu);
  const menuItems = menu.flatMap((menuSection) => menuSection.items);

  const [menuView, setMenuView] = useState("Checkbox List");
  const [itemsToEdit, setItemsToEdit] = useState<MenuItemType[]>([]);
  const [showPriceEdit, setShowPriceEdit] = useState(false);

  const [newPrices, setNewPrices] = useState<{
    base: number;
    large?: number;
  }>({ base: 0 });

  console.log(newPrices);
  console.log(itemsToEdit);

  const onCloseDrawer = () => {
    props.onClose();
    setNewPrices({ base: 0 });
  };

  const onSelectItemToEdit = (itemIds: string[]) =>
    setItemsToEdit(
      menuItems.filter((item) => itemIds.some((id) => item.id === id)),
    );

  return (
    <Drawer
      offset={12}
      radius="sm"
      position="right"
      opened={props.isOpen}
      onClose={onCloseDrawer}
      withCloseButton={false}
      trapFocus={false}
    >
      <Stack align="flex-end">
        <Text size="1.4em" fw="600" ta="left" w="100%">
          UPDATE PRICES
        </Text>

        {showPriceEdit ? (
          <Stack w="100%">
            <Stack w="100%" gap="xs">
              <Text>Selected Items to Edit</Text>
              <Stack w="100%" gap="0" bdrs="sm" bd="solid 1px darkslategray">
                {itemsToEdit.map((item, index) => (
                  <>
                    {index !== 0 && <Divider my="0" />}
                    <Flex
                      w="100%"
                      pr="sm"
                      align="center"
                      justify="space-between"
                    >
                      <Stack key={item.id} gap="0" p="sm">
                        <Text fw="bold">{item.label}</Text>
                        <Text>{item.description}</Text>
                      </Stack>

                      <Stack gap="0" py="xs">
                        <Text>
                          {item.large_price || (newPrices.large && "S: ")}$
                          {item.price.toFixed(2)}
                          {" -> "}${newPrices.base.toFixed(2)}
                        </Text>
                        {item.large_price && !newPrices.large && (
                          <Text>L: ${item.large_price.toFixed(2)}</Text>
                        )}
                        {newPrices.large && (
                          <Text>
                            L: ${(item.large_price || 0).toFixed(2)}
                            {" -> "}${newPrices.large.toFixed(2)}
                          </Text>
                        )}
                      </Stack>
                    </Flex>
                  </>
                ))}
              </Stack>
            </Stack>

            <Stack gap="xs">
              <NumberInput
                label="Base Price"
                value={newPrices?.base}
                onChange={(price) =>
                  setNewPrices({
                    ...newPrices,
                    base: typeof price === "string" ? Number(price) : price,
                  })
                }
              />

              <NumberInput
                label="Large"
                description="Leave blank if not applicable"
                value={newPrices?.large}
                onChange={(price) =>
                  setNewPrices({
                    ...newPrices,
                    large: typeof price === "string" ? Number(price) : price,
                  })
                }
              />
            </Stack>

            <Group grow>
              <StyledButton
                label="Cancel"
                variant="outline"
                onClick={onCloseDrawer}
              />
              <StyledButton
                label="Save Changes"
                onClick={() => setShowPriceEdit(true)}
              />
            </Group>
          </Stack>
        ) : (
          <Stack w="100%">
            <Stack w="100%" gap="xs" bd="solid 1px lightgray" bdrs="sm" p="sm">
              <Stack gap="0">
                <Text>Select Items to Update</Text>

                <SegmentedControl
                  w="100%"
                  value={menuView}
                  onChange={(value) =>
                    setMenuView(value as "Checkbox List" | "Multiselect")
                  }
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
                      value={itemsToEdit.map(({ id }) => id)}
                      onChange={onSelectItemToEdit}
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
                  placeholder="Select item to edit"
                  nothingFoundMessage="No items found matching your search"
                  value={itemsToEdit.map(({ id }) => id)}
                  onChange={onSelectItemToEdit}
                  data={menuItems.map((item) => ({
                    value: item.id,
                    label: item.label,
                  }))}
                  hidePickedOptions
                  searchable
                />
              )}
            </Stack>
            <Group grow>
              <StyledButton
                label="Cancel"
                variant="outline"
                onClick={onCloseDrawer}
              />
              <StyledButton
                label="Edit Selection"
                onClick={() => setShowPriceEdit(true)}
              />
            </Group>
          </Stack>
        )}
      </Stack>
    </Drawer>
  );
}

export default UpdatePricesDrawer;
