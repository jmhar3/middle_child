import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

import {
  Text,
  Flex,
  Group,
  Image,
  Stack,
  Switch,
  Textarea,
  TextInput,
  FileButton,
  MultiSelect,
  NumberInput,
} from "@mantine/core";

import MenuItemModal from "../../../MenuItemModal";
import StyledButton from "../../../StyledButton";

import { useAppDispatch, useAppSelector } from "../../../../state/hooks";
import { selectAllModifiers } from "../../../../state/modifiers/modifiersSlice";
import { selectAllItemOptions } from "../../../../state/itemOptions/itemOptionsSlice";
import { upsertMenuItems } from "../../../../state/menuItems/menuItemsThunks";

import type { MenuItemType } from "../../../../state/types";

interface EditableItemProps {
  menuItem: MenuItemType;
  showCancelButton?: boolean;
  onCloseEditableItem: () => void;
}

function EditableItem(props: EditableItemProps) {
  const { menuItem, onCloseEditableItem, showCancelButton = true } = props;
  const dispatch = useAppDispatch();
  const modifiers = useAppSelector(selectAllModifiers);
  const itemOptions = useAppSelector(selectAllItemOptions);

  const [file, setFile] = useState<File | null>(null);
  const [editedMenuItem, setEditedMenuItem] = useState<MenuItemType>(menuItem);
  const [isUpdatingMenuItems, setIsUpdatingMenuItems] = useState(false);

  const [showItemPreview, { open: openItemPreview, close: closeItemPreview }] =
    useDisclosure(false);

  const imageUrl = file && URL.createObjectURL(file);

  const onUpsertMenuItem = () => {
    setIsUpdatingMenuItems(true);
    dispatch(upsertMenuItems(editedMenuItem)).finally(() => {
      setIsUpdatingMenuItems(false);
      onCloseEditableItem();
    });
  };

  return (
    <>
      <MenuItemModal
        menuItem={editedMenuItem}
        isOpen={showItemPreview}
        onClose={closeItemPreview}
        onAddToOrder={() => {}}
      />

      <Stack p="sm">
        {file && <Image src={imageUrl} />}

        <Group gap="sm" grow align="flex-end">
          <TextInput
            withAsterisk
            label="Label"
            value={editedMenuItem.label.toUpperCase()}
            onChange={(event) =>
              setEditedMenuItem((prevItem) => ({
                ...prevItem,
                label: event.target.value,
              }))
            }
          />

          <NumberInput
            label="Price"
            value={editedMenuItem.price}
            onChange={(value) =>
              setEditedMenuItem((prevItem) => ({
                ...prevItem,
                price: typeof value === "number" ? value : parseFloat(value),
              }))
            }
          />
        </Group>

        <Group gap="sm" grow align="flex-end">
          <MultiSelect
            size="md"
            searchable
            label="Modifiers"
            description="User is able to select multiple modifiers"
            defaultValue={editedMenuItem.modifiers?.map(({ id }) => id)}
            data={modifiers.map(({ id, label, price }) => ({
              value: id,
              label: price ? `${label} (+$${price.toFixed(2)})` : label,
            }))}
            onChange={(values) =>
              setEditedMenuItem((prevItem) => ({
                ...prevItem,
                modifiers: values
                  .map((id) => modifiers.find((modifier) => modifier.id === id))
                  .filter((modifier) => modifier !== undefined),
              }))
            }
          />
          <MultiSelect
            size="md"
            searchable
            label="Modifier Categories"
            defaultValue={editedMenuItem.modifierCategories?.map(
              ({ id }) => id,
            )}
            data={itemOptions.map((category) => ({
              value: category.id,
              label: category.label,
            }))}
            onChange={(values) =>
              setEditedMenuItem((prevItem) => ({
                ...prevItem,
                modifierCategories: values
                  .map((id) =>
                    itemOptions.find((category) => category.id === id),
                  )
                  .filter((category) => category !== undefined),
              }))
            }
          />
        </Group>

        <Group gap="sm" grow align="flex-end">
          <Textarea
            label="Description"
            value={editedMenuItem.description}
            onChange={(event) =>
              setEditedMenuItem((prevItem) => ({
                ...prevItem,
                description: event.target.value,
              }))
            }
          />

          <Stack gap="3">
            <Text>Image: {file?.name}</Text>
            <FileButton onChange={setFile} accept="image/png,image/jpeg">
              {(props) => (
                <StyledButton
                  {...props}
                  label={file ? "Replace image" : "Upload image"}
                />
              )}
            </FileButton>
          </Stack>
        </Group>

        <Flex justify="space-between">
          <Group>
            <Switch
              label="In Stock"
              withThumbIndicator={false}
              checked={menuItem.is_in_stock}
              onChange={(event) =>
                setEditedMenuItem((prevItem) => ({
                  ...prevItem,
                  is_in_stock: event.target.checked,
                }))
              }
            />
            <Switch
              label="Loyalty Perk"
              withThumbIndicator={false}
              checked={menuItem.is_applicable_loyalty_item}
              onChange={(event) =>
                setEditedMenuItem((prevItem) => ({
                  ...prevItem,
                  is_applicable_loyalty_item: event.target.checked,
                }))
              }
            />
            <Switch
              label="Long Prep Time"
              withThumbIndicator={false}
              checked={menuItem.has_long_prep_time}
              onChange={(event) =>
                setEditedMenuItem((prevItem) => ({
                  ...prevItem,
                  has_long_prep_time: event.target.checked,
                }))
              }
            />
          </Group>

          <Flex gap="sm" justify="flex-end">
            <StyledButton
              label="Preview"
              variant="outline"
              onClick={openItemPreview}
            />

            {showCancelButton && (
              <StyledButton
                label="Cancel"
                onClick={onCloseEditableItem}
                isLoading={isUpdatingMenuItems}
              />
            )}

            <StyledButton
              label="Save"
              isLoading={isUpdatingMenuItems}
              onClick={onUpsertMenuItem}
              isDisabled={
                menuItem === editedMenuItem || editedMenuItem.label.length === 0
              }
            />
          </Flex>
        </Flex>
      </Stack>
    </>
  );
}

export default EditableItem;
