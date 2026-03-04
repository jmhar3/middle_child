import { useState } from "react";

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

import { modifierCategories } from "../../../helpers/menu";

import type { ItemOptions } from "../../../helpers/menu";

interface UpsertItemOptionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUpsertItemOptions: (modifier: ItemOptions) => void;
}

function UpsertItemOptionDrawer(props: UpsertItemOptionDrawerProps) {
  const { isOpen, onClose, onUpsertItemOptions } = props;

  const [itemOptionsToEdit, setItemOptionsToEdit] = useState<
    ItemOptions | undefined
  >();
  const [itemOption, setItemOption] = useState<ItemOptions | undefined>();

  const clearDrawer = () => {
    setItemOptionsToEdit(undefined);
    setItemOption(undefined);
    onClose();
  };
  return (
    <Drawer
      offset={12}
      radius="sm"
      position="right"
      opened={isOpen}
      onClose={() => {
        setItemOption(undefined);
        clearDrawer();
      }}
      withCloseButton={false}
      trapFocus={false}
    >
      <Stack align="flex-end">
        <Text size="1.4em" fw="600" ta="left" w="100%">
          ADD / EDIT MODIFIER CATEGORY
        </Text>

        <Divider w="100%" />

        <Stack w="100%">
          <Select
            w="100%"
            size="md"
            label="Select modifier category to edit"
            nothingFoundMessage="No modifier category found matching your search"
            onChange={(value) =>
              setItemOptionsToEdit(
                modifierCategories.find(({ id }) => id === value),
              )
            }
            data={modifierCategories.map((modifier) => ({
              value: modifier.id,
              label: modifier.label,
            }))}
            disabled={!!itemOption}
            searchable
          />
          <StyledButton
            label="Edit Modifier Category"
            onClick={() => setItemOption(itemOptionsToEdit)}
            isDisabled={!!itemOption}
          />

          <Text w="100%" ta="center">
            OR
          </Text>

          <StyledButton
            variant="outline"
            label="Create New Modifier Category"
            onClick={() =>
              setItemOption({
                id: "99",
                label: "",
                modifiers: [],
                allowMultipleSelections: false,
              })
            }
            isDisabled={!!itemOption}
          />
        </Stack>

        {itemOption !== undefined && (
          <>
            <Divider w="100%" />

            <TextInput
              w="100%"
              withAsterisk
              label="Label"
              defaultValue={itemOption.label}
              onChange={(event) =>
                setItemOption((itemOption) =>
                  itemOption
                    ? {
                        ...itemOption,
                        label: event.target.value,
                      }
                    : {
                        id: "99",
                        label: event.target.value,
                        allowMultipleSelections: false,
                        modifiers: [],
                      },
                )
              }
            />

            <MultiSelect
              w="100%"
              size="md"
              withAsterisk
              label="Select included modifiers"
              nothingFoundMessage="No modifiers found matching your search"
              data={modifierCategories.map((modifier) => ({
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
                setItemOption((prevItemOption) =>
                  prevItemOption
                    ? {
                        ...prevItemOption,
                        allowMultipleSelections: event.target.checked,
                      }
                    : {
                        id: "99",
                        label: "",
                        allowMultipleSelections: event.target.checked,
                        modifiers: [],
                      },
                )
              }
            />

            <Divider w="100%" />

            <Group gap="sm">
              <StyledButton
                variant="outline"
                label="Cancel"
                onClick={() => {
                  setItemOption(undefined);
                  clearDrawer();
                }}
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
