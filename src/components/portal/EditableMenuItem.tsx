import {
  Flex,
  Group,
  MultiSelect,
  NumberInput,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";

import StyledButton from "../StyledButton";

import { modifierCategories } from "../../helpers/menu";

import type { MenuItemType } from "../../helpers/menu";
import { useDisclosure } from "@mantine/hooks";

interface EditableMenuItemProps {
  menuItem: MenuItemType;
}

function EditableMenuItem(props: EditableMenuItemProps) {
  const { menuItem } = props;

  const [showItemEdit, { open: openItemEdit, close: closeItemEdit }] =
    useDisclosure(false);

  return showItemEdit ? (
    <Stack p="sm">
      <Group gap="sm" grow>
        <TextInput label="Label" value={menuItem.label.toUpperCase()} />
        <NumberInput label="Price" value={menuItem.price} />
        <TextInput label="Image" />
      </Group>

      <Group gap="sm" grow align="flex-start">
        <MultiSelect
          size="md"
          searchable
          label="Ingredients"
          data={modifierCategories.map((category) => ({
            value: category.label,
            label: category.label,
          }))}
        />
        <MultiSelect
          size="md"
          searchable
          label="Modifiers"
          data={modifierCategories.map((category) => ({
            value: category.label,
            label: category.label,
          }))}
        />
        <MultiSelect
          size="md"
          searchable
          label="Modifier Categories"
          defaultValue={["1", "2", "3", "4"]}
          data={modifierCategories.map((category) => ({
            value: category.label,
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
          <StyledButton label="Preview" variant="outline" onClick={() => {}} />
          <StyledButton label="Save" onClick={closeItemEdit} />
        </Flex>
      </Flex>
    </Stack>
  ) : (
    <Flex justify="space-between" p="sm" align="center">
      <Text fs="1.4em" fw="600">
        {menuItem.label.toUpperCase()}
      </Text>
      <StyledButton label="Edit" onClick={openItemEdit} />
    </Flex>
  );
}

export default EditableMenuItem;
