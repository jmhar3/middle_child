import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

import {
  Flex,
  Group,
  Image,
  Stack,
  Switch,
  TextInput,
  FileButton,
  MultiSelect,
  NumberInput,
} from "@mantine/core";

import MenuItemModal from "../../MenuItemModal";
import StyledButton from "../../StyledButton";

import { useAppSelector } from "../../../state/hooks";
import { selectAllModifiers } from "../../../state/modifiers/modifiersSlice";

// to be removed
import type { MenuItemType } from "../../../types/menu";
import { selectAllItemOptions } from "../../../state/itemOptions/itemOptionsSlice";

interface EditableItemProps {
  menuItem: MenuItemType;
  showCancelButton?: boolean;
  onSaveMenuItem: (newMenuItem: MenuItemType) => void;
  onCancelCreateItem: () => void;
}

function EditableItem(props: EditableItemProps) {
  const {
    menuItem,
    onSaveMenuItem,
    onCancelCreateItem,
    showCancelButton = true,
  } = props;
  const modifiers = useAppSelector(selectAllModifiers);
  const itemOptions = useAppSelector(selectAllItemOptions);

  const [file, setFile] = useState<File | null>(null);
  const [editedMenuItem, setEditedMenuItem] = useState<MenuItemType>(menuItem);

  const [showItemPreview, { open: openItemPreview, close: closeItemPreview }] =
    useDisclosure(false);

  const imageUrl = file && URL.createObjectURL(file);

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

          <FileButton onChange={setFile} accept="image/png,image/jpeg">
            {(props) => (
              <StyledButton
                {...props}
                label={file ? "Replace image" : "Upload image"}
              />
            )}
          </FileButton>
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
              <StyledButton label="Cancel" onClick={onCancelCreateItem} />
            )}

            <StyledButton
              label="Save"
              isDisabled={
                menuItem === editedMenuItem || editedMenuItem.label.length === 0
              }
              onClick={() => onSaveMenuItem(editedMenuItem)}
            />
          </Flex>
        </Flex>
      </Stack>
    </>
  );
}

export default EditableItem;
