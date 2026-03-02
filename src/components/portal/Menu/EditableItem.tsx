import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

import {
  FileButton,
  Flex,
  Group,
  Image,
  MultiSelect,
  NumberInput,
  Stack,
  Switch,
  TextInput,
} from "@mantine/core";

import MenuItemModal from "../../MenuItemModal";
import StyledButton from "../../StyledButton";

import {
  ingredients,
  modifierCategories,
  modifiers,
} from "../../../helpers/menu";

import type { MenuItemType } from "../../../helpers/menu";

interface EditableItemProps {
  menuItem: MenuItemType;
  onSaveMenuItem: (newMenuItem: MenuItemType) => void;
  onCancelCreateItem: () => void;
}

function EditableItem(props: EditableItemProps) {
  const { menuItem, onSaveMenuItem, onCancelCreateItem } = props;

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

        <Group gap="sm" grow align="flex-start">
          <MultiSelect
            size="md"
            searchable
            label="Ingredients"
            description="Out of stock ingredients affect item stock"
            defaultValue={editedMenuItem.ingredients?.map(({ id }) => id)}
            data={ingredients.map((ingredient) => ({
              value: ingredient.id,
              label: ingredient.label,
            }))}
            onChange={(values) =>
              setEditedMenuItem((prevItem) => ({
                ...prevItem,
                ingredients: values
                  .map((id) =>
                    ingredients.find((ingredient) => ingredient.id === id),
                  )
                  .filter((ingredient) => ingredient !== undefined),
              }))
            }
          />
          <MultiSelect
            size="md"
            searchable
            label="Modifiers"
            description="User is able to select multiple modifiers"
            defaultValue={editedMenuItem.modifiers?.map(({ id }) => id)}
            data={modifiers.map((modifier) => ({
              value: modifier.id,
              label: modifier.label,
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
            data={modifierCategories.map((category) => ({
              value: category.id,
              label: category.label,
            }))}
            onChange={(values) =>
              setEditedMenuItem((prevItem) => ({
                ...prevItem,
                modifierCategories: values
                  .map((id) =>
                    modifierCategories.find((category) => category.id === id),
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
              checked={menuItem.isInStock}
              onChange={(event) =>
                setEditedMenuItem((prevItem) => ({
                  ...prevItem,
                  isInStock: event.target.checked,
                }))
              }
            />
            <Switch
              label="Loyalty Perk"
              withThumbIndicator={false}
              checked={menuItem.isLoyaltyApplicable}
              onChange={(event) =>
                setEditedMenuItem((prevItem) => ({
                  ...prevItem,
                  isLoyaltyApplicable: event.target.checked,
                }))
              }
            />
            <Switch
              label="Long Prep Time"
              withThumbIndicator={false}
              checked={menuItem.hasLongPrepTime}
              onChange={(event) =>
                setEditedMenuItem((prevItem) => ({
                  ...prevItem,
                  hasLongPrepTime: event.target.checked,
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

            <StyledButton label="Cancel" onClick={onCancelCreateItem} />

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
