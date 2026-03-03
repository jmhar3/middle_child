import { useState } from "react";

import {
  Text,
  Stack,
  Group,
  Drawer,
  Divider,
  TextInput,
  Select,
  NumberInput,
  Switch,
  ColorInput,
} from "@mantine/core";

import StyledButton from "../../StyledButton";

import { modifiers } from "../../../helpers/menu";

import type { Modifier } from "../../../helpers/menu";

interface AddEditModifierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEditModifier: (modifier: Modifier) => void;
}

function AddEditModifierDrawer(props: AddEditModifierDrawerProps) {
  const { isOpen, onClose, onAddEditModifier } = props;

  const [modifierToEdit, setModifierToEdit] = useState<Modifier | undefined>();
  const [modifier, setModifier] = useState<Modifier | undefined>();

  const clearDrawer = () => {
    setModifierToEdit(undefined);
    setModifier(undefined);
    onClose();
  };

  return (
    <Drawer
      offset={12}
      radius="sm"
      position="right"
      opened={isOpen}
      onClose={() => {
        setModifier(undefined);
        clearDrawer();
      }}
      withCloseButton={false}
    >
      <Stack align="flex-end">
        <Text size="1.4em" fw="600" ta="left" w="100%">
          ADD / EDIT MODIFIER
        </Text>

        <Divider w="100%" />

        <Stack w="100%">
          <Select
            w="100%"
            size="md"
            label="Select modifier to edit"
            nothingFoundMessage="No modifiers found matching your search"
            onChange={(value) =>
              setModifierToEdit(modifiers.find(({ id }) => id === value))
            }
            data={modifiers.map((modifier) => ({
              value: modifier.id,
              label: modifier.label,
            }))}
            disabled={!!modifier}
            searchable
          />

          <StyledButton
            label="Edit Modifier"
            onClick={() => setModifier(modifierToEdit)}
            isDisabled={!!modifier}
          />

          <Text w="100%" ta="center">
            OR
          </Text>

          <StyledButton
            variant="outline"
            label="Create New Modifier"
            onClick={() => setModifier({ id: "", label: "" })}
            isDisabled={!!modifier}
          />
        </Stack>

        {modifier !== undefined && (
          <>
            <Divider w="100%" />

            <TextInput
              w="100%"
              withAsterisk
              label="Label"
              value={modifier.label}
              onChange={(event) =>
                setModifier((prevModifier) =>
                  prevModifier
                    ? {
                        ...prevModifier,
                        label: event.target.value,
                      }
                    : { id: "", label: event.target.value },
                )
              }
            />

            <Group w="100%">
              <NumberInput
                w="100%"
                label="Price"
                value={modifier.price}
                onChange={(value) =>
                  setModifier(
                    (prevModifier) =>
                      prevModifier && {
                        ...prevModifier,
                        id: prevModifier.id,
                        price:
                          typeof value === "number" ? value : parseFloat(value),
                      },
                  )
                }
              />

              <ColorInput
                w="100%"
                label="Tag Colour"
                value={modifier.color || "#2f4f4f"}
                swatches={[
                  "#2f4f4f",
                  "#868e96",
                  "#fa5252",
                  "#e64980",
                  "#be4bdb",
                  "#7950f2",
                  "#4c6ef5",
                  "#228be6",
                  "#15aabf",
                  "#12b886",
                  "#40c057",
                  "#82c91e",
                  "#fab005",
                  "#fd7e14",
                ]}
                onChange={(value) =>
                  setModifier((prevModifier) =>
                    prevModifier
                      ? {
                          ...prevModifier,
                          color: value,
                        }
                      : { id: "", label: "", color: value },
                  )
                }
              />
            </Group>

            <Switch
              w="100%"
              label="Is Ingredient"
              description="Ingredients can be marked out of stock"
              withThumbIndicator={false}
              checked={modifier.isIngredient}
              onChange={(event) =>
                setModifier((prevModifier) =>
                  prevModifier
                    ? {
                        ...prevModifier,
                        isIngredient: event.target.checked,
                      }
                    : {
                        id: "",
                        label: "",
                        isIngredient: event.target.checked,
                      },
                )
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
                  if (modifier.label.length > 0) {
                    onAddEditModifier(modifier);
                    clearDrawer();
                  }
                }}
              />
            </Group>
          </>
        )}
      </Stack>
    </Drawer>
  );
}

export default AddEditModifierDrawer;
