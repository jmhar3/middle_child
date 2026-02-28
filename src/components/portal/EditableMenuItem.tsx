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

import MenuItemModal from "../MenuItemModal";
import StyledButton from "../StyledButton";
import MenuItem from "./MenuItem";

import { ingredients, modifierCategories, modifiers } from "../../helpers/menu";

import type { MenuItemType } from "../../helpers/menu";

interface EditableMenuItemProps {
  menuItem: MenuItemType;
}

function EditableMenuItem(props: EditableMenuItemProps) {
  const { menuItem } = props;

  const [file, setFile] = useState<File | null>(null);
  const [editedMenuItem, setEditedMenuItem] = useState<MenuItemType>(menuItem);

  const [
    showEditableMenuItem,
    { open: openEditableMenuItem, close: closeEditableMenuItem },
  ] = useDisclosure(false);
  const [showItemPreview, { open: openItemPreview, close: closeItemPreview }] =
    useDisclosure(false);

  const imageUrl = file && URL.createObjectURL(file);

  return showEditableMenuItem ? (
    <>
      <MenuItemModal
        menuItem={editedMenuItem}
        isOpen={showItemPreview}
        onClose={closeItemPreview}
        onAddToOrder={() => {}}
      />

      <Stack p="sm">
        <Group gap="sm" grow align="flex-end">
          <TextInput
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
          {file ? (
            <Flex>
              <Image src={imageUrl} />
              <FileButton onChange={setFile} accept="image/png,image/jpeg">
                {(props) => <StyledButton {...props} label="Upload image" />}
              </FileButton>
            </Flex>
          ) : (
            <FileButton onChange={setFile} accept="image/png,image/jpeg">
              {(props) => <StyledButton {...props} label="Upload image" />}
            </FileButton>
          )}
        </Group>

        <Group gap="sm" grow align="flex-start">
          <MultiSelect
            size="md"
            searchable
            label="Ingredients"
            value={editedMenuItem.ingredients?.map(({ id }) => id)}
            data={ingredients.map((ingredient) => ({
              value: ingredient.id,
              label: ingredient.label,
            }))}
          />
          <MultiSelect
            size="md"
            searchable
            label="Modifiers"
            value={editedMenuItem.modifiers?.map(({ id }) => id)}
            data={modifiers.map((modifier) => ({
              value: modifier.id,
              label: modifier.label,
            }))}
          />
          <MultiSelect
            size="md"
            searchable
            label="Modifier Categories"
            value={editedMenuItem.modifierCategories?.map(({ id }) => id)}
            data={modifierCategories.map((category) => ({
              value: category.id,
              label: category.label,
            }))}
          />
        </Group>

        <Flex justify="space-between">
          <Group>
            <Switch
              checked={menuItem.isInStock}
              withThumbIndicator={false}
              label="In Stock"
            />
            <Switch
              checked={menuItem.isLoyaltyApplicable}
              withThumbIndicator={false}
              label="Loyalty Perk"
            />
            <Switch
              checked={menuItem.hasLongPrepTime}
              withThumbIndicator={false}
              label="Long Prep Time"
            />
          </Group>
          <Flex gap="sm" justify="flex-end">
            <StyledButton
              label="Preview"
              variant="outline"
              onClick={openItemPreview}
            />
            <StyledButton label="Save" onClick={closeEditableMenuItem} />
          </Flex>
        </Flex>
      </Stack>
    </>
  ) : (
    <MenuItem onEditItemClick={openEditableMenuItem} menuItem={menuItem} />
  );
}

export default EditableMenuItem;
