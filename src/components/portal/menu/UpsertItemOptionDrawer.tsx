import { useState } from "react";
import { v4 as uuid } from "uuid";

import {
  Text,
  Stack,
  Group,
  Select,
  Switch,
  Drawer,
  Divider,
  TextInput,
  MultiSelect,
} from "@mantine/core";

import StyledButton from "../../StyledButton";

import type { ItemOptions, Modifier } from "../../../helpers/menu";

interface UpsertItemOptionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUpsertItemOptions: (modifier: ItemOptions) => void;
  modifierCategories: ItemOptions[];
  modifiers: Modifier[];
}

function UpsertItemOptionDrawer(props: UpsertItemOptionDrawerProps) {
  const {
    isOpen,
    onClose,
    onUpsertItemOptions,
    modifierCategories,
    modifiers,
  } = props;

  const blankItemOption = {
    id: uuid(),
    label: "",
    modifiers: [],
    allowMultipleSelections: false,
  };

  const [itemOption, setItemOption] = useState<ItemOptions>(blankItemOption);
  const [addOrEdit, setAddOrEdit] = useState<"add" | "edit" | undefined>();

  const clearDrawer = () => {
    setAddOrEdit(undefined);
    setItemOption(blankItemOption);
    onClose();
  };
  console.log(itemOption);
  return (
    <Drawer
      offset={12}
      radius="sm"
      position="right"
      opened={isOpen}
      onClose={clearDrawer}
      withCloseButton={false}
      trapFocus={false}
    >
      <Stack align="flex-end">
        <Text size="1.4em" fw="600" ta="left" w="100%">
          {addOrEdit ? addOrEdit.toUpperCase() : "ADD / EDIT"} MODIFIER CATEGORY
        </Text>

        <Divider w="100%" />

        <Stack w="100%">
          <Select
            w="100%"
            size="md"
            label="Select modifier category to edit"
            nothingFoundMessage="No modifier category found matching your search"
            onChange={(value) => {
              const findItemOption = modifierCategories.find(
                ({ id }) => id === value,
              );
              if (findItemOption) setItemOption(findItemOption);
            }}
            data={modifierCategories.map((itemOption) => ({
              value: itemOption.id,
              label: itemOption.label,
            }))}
            disabled={!!addOrEdit}
            searchable
          />
          <StyledButton
            label="Edit Modifier Category"
            onClick={() => setAddOrEdit("edit")}
            isDisabled={!!addOrEdit}
          />

          <Text w="100%" ta="center">
            OR
          </Text>

          <StyledButton
            variant="outline"
            label="Create New Modifier Category"
            onClick={() => {
              setItemOption(blankItemOption);
              setAddOrEdit("add");
            }}
            isDisabled={!!addOrEdit}
          />
        </Stack>

        {addOrEdit !== undefined && (
          <>
            <Divider w="100%" />

            <TextInput
              w="100%"
              withAsterisk
              label="Label"
              defaultValue={itemOption.label}
              onChange={(event) =>
                setItemOption((itemOption) => ({
                  ...itemOption,
                  label: event.target.value,
                }))
              }
            />

            <MultiSelect
              w="100%"
              size="md"
              withAsterisk
              label="Select included modifiers"
              nothingFoundMessage="No modifiers found matching your search"
              defaultValue={itemOption.modifiers.map(({ id }) => id)}
              data={modifiers.map((modifier) => ({
                value: modifier.id,
                label: modifier.label,
              }))}
              searchable
            />

            <Switch
              w="100%"
              label="Allow Multiple Selections"
              description="Turn off to force user to choose one option"
              withThumbIndicator={false}
              checked={itemOption.allowMultipleSelections}
              onChange={(event) =>
                setItemOption((prevItemOption) => ({
                  ...prevItemOption,
                  allowMultipleSelections: event.target.checked,
                }))
              }
            />

            <Divider w="100%" />

            <Group gap="sm">
              <StyledButton
                variant="outline"
                label="Cancel"
                onClick={clearDrawer}
              />

              <StyledButton
                label="Save"
                onClick={() => {
                  clearDrawer();
                  onUpsertItemOptions(itemOption);
                }}
              />
            </Group>
          </>
        )}
      </Stack>
    </Drawer>
  );
}

export default UpsertItemOptionDrawer;
