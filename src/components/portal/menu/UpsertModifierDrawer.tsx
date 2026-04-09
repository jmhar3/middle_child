import { useState } from "react";
import { v4 as uuid } from "uuid";
import { notifications } from "@mantine/notifications";

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

import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { selectAllModifiers } from "../../../state/modifiers/modifiersSlice";

import type { Modifier } from "../../../state/modifiers/modifiersSlice";
import { upsertModifier } from "../../../state/modifiers/modifierThunks";

interface UpsertModifierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const blankModifier = {
  id: uuid(),
  label: "",
};

function UpsertModifierDrawer(props: UpsertModifierDrawerProps) {
  const { isOpen, onClose } = props;

  const dispatch = useAppDispatch();

  const modifiers = useAppSelector(selectAllModifiers);
  const [modifier, setModifier] = useState<Modifier>(blankModifier);
  const [addOrEdit, setAddOrEdit] = useState<"add" | "edit" | undefined>();

  const clearDrawer = () => {
    setModifier(blankModifier);
    setAddOrEdit(undefined);
    onClose();
  };

  const onUpsertModifier = () => {
    dispatch(upsertModifier([modifier]))
      .then(() => {
        notifications.show({
          withCloseButton: false,
          message: `${modifier ? modifier.label : "Modifier"} successfully updated`,
          position: "bottom-right",
          color: "green",
        });
        clearDrawer();
      })
      .catch((error) =>
        notifications.show({
          message: error,
          withCloseButton: false,
          position: "bottom-right",
          color: "red",
        }),
      );
  };

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
          {addOrEdit ? addOrEdit.toUpperCase() : "ADD / EDIT"} MODIFIER
        </Text>

        <Divider w="100%" />

        <Stack w="100%">
          <Select
            w="100%"
            size="md"
            label="Select modifier to edit"
            nothingFoundMessage="No modifiers found matching your search"
            onChange={(value) => {
              const findModifier = modifiers.find(({ id }) => id === value);
              if (findModifier) setModifier(findModifier);
            }}
            data={modifiers.map(({ id, label, price }) => ({
              value: id,
              label: price ? `${label} +$${price.toFixed(2)}` : label,
            }))}
            disabled={!!addOrEdit}
            searchable
          />

          <StyledButton
            label="Edit Modifier"
            onClick={() => setAddOrEdit("edit")}
            isDisabled={!!addOrEdit}
          />

          <Text w="100%" ta="center">
            OR
          </Text>

          <StyledButton
            variant="outline"
            label="Create New Modifier"
            onClick={() => {
              setModifier(blankModifier);
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
              value={modifier.label}
              onChange={(event) =>
                setModifier(
                  (prevModifier) =>
                    prevModifier && {
                      ...prevModifier,
                      label: event.target.value,
                    },
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
                  setModifier(
                    (prevModifier) =>
                      prevModifier && {
                        ...prevModifier,
                        color: value,
                      },
                  )
                }
              />
            </Group>

            <Switch
              w="100%"
              label="Is Ingredient"
              description="Ingredients can be marked out of stock"
              withThumbIndicator={false}
              checked={modifier.is_ingredient}
              onChange={(event) =>
                setModifier(
                  (prevModifier) =>
                    prevModifier && {
                      ...prevModifier,
                      is_ingredient: event.target.checked,
                    },
                )
              }
            />

            {modifier.is_ingredient && (
              <Switch
                w="100%"
                label="Is In Stock"
                description="Out of stock ingredients affect menu item stock"
                withThumbIndicator={false}
                checked={modifier.is_in_stock}
                onChange={(event) =>
                  setModifier(
                    (prevModifier) =>
                      prevModifier && {
                        ...prevModifier,
                        is_in_stock: event.target.checked,
                      },
                  )
                }
              />
            )}

            <Divider w="100%" />

            <Group gap="sm">
              <StyledButton
                variant="outline"
                label="Cancel"
                onClick={clearDrawer}
              />

              <StyledButton
                label="Save"
                onClick={() => modifier.label.length > 0 && onUpsertModifier()}
              />
            </Group>
          </>
        )}
      </Stack>
    </Drawer>
  );
}

export default UpsertModifierDrawer;
