import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { Group, Switch, Divider, TextInput, NumberInput } from "@mantine/core";

import StyledButton from "../../StyledButton";

import { useAppDispatch } from "../../../state/hooks";
import { upsertModifiers } from "../../../state/modifiers/modifierThunks";

import type { Modifier } from "../../../state/modifiers/modifiersSlice";

interface UpsertModifierProps {
  modifier: Partial<Modifier>;
  onClose: () => void;
}

function UpsertModifier(props: UpsertModifierProps) {
  const { modifier, onClose } = props;

  const dispatch = useAppDispatch();

  const [editedModifier, setEditedModifier] =
    useState<Partial<Modifier>>(modifier);
  const onUpsertModifier = () => {
    dispatch(upsertModifiers([editedModifier]))
      .then(() => {
        notifications.show({
          withCloseButton: false,
          message: `${editedModifier.label} successfully ${modifier.label?.length === 0 ? "updated" : "created"}`,
          position: "bottom-right",
          color: "green",
        });
        onClose();
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
    <>
      <TextInput
        w="100%"
        withAsterisk
        label="Label"
        value={editedModifier.label}
        onChange={(event) =>
          setEditedModifier(
            (prevModifier) =>
              prevModifier && {
                ...prevModifier,
                label: event.target.value,
              },
          )
        }
      />

      <Group grow w="100%">
        <NumberInput
          label="Price"
          value={editedModifier.price}
          onChange={(value) =>
            setEditedModifier(
              (prevModifier) =>
                prevModifier && {
                  ...prevModifier,
                  price: typeof value === "number" ? value : parseFloat(value),
                },
            )
          }
        />

        <TextInput
          label="Reference Code"
          value={editedModifier.reference_code}
          onChange={(event) =>
            setEditedModifier(
              (prevModifier) =>
                prevModifier && {
                  ...prevModifier,
                  reference_code: event.target.value,
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
        checked={editedModifier.is_ingredient}
        onChange={(event) =>
          setEditedModifier(
            (prevModifier) =>
              prevModifier && {
                ...prevModifier,
                is_ingredient: event.target.checked,
              },
          )
        }
      />

      {editedModifier.is_ingredient && (
        <Switch
          w="100%"
          label="Is In Stock"
          description="Out of stock ingredients affect menu item stock"
          withThumbIndicator={false}
          checked={editedModifier.is_in_stock}
          onChange={(event) =>
            setEditedModifier(
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
        <StyledButton variant="outline" label="Cancel" onClick={onClose} />

        <StyledButton
          label="Save"
          onClick={() =>
            editedModifier.label &&
            editedModifier.label.length > 0 &&
            onUpsertModifier()
          }
        />
      </Group>
    </>
  );
}

export default UpsertModifier;
