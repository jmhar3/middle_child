import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { Group, Switch, Divider, TextInput, MultiSelect } from "@mantine/core";

import StyledButton from "../../../StyledButton";

import { useAppDispatch, useAppSelector } from "../../../../state/hooks";
import { selectAllModifiers } from "../../../../state/modifiers/modifiersSlice";
import { upsertOptions } from "../../../../state/itemOptions/itemOptionThunks";

import type { ItemOptions } from "../../../../state/types";

interface UpsertOptionProps {
  itemOption: Partial<ItemOptions>;
  onClose: () => void;
}

function UpsertOption(props: UpsertOptionProps) {
  const { itemOption, onClose } = props;

  const dispatch = useAppDispatch();
  const modifiers = useAppSelector(selectAllModifiers);

  const [editedOption, setEditedOption] =
    useState<Partial<ItemOptions>>(itemOption);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onUpsertOption = () => {
    setIsSubmitting(true);
    dispatch(upsertOptions([editedOption]))
      .then(() => {
        notifications.show({
          withCloseButton: false,
          message: `${editedOption.label} successfully ${itemOption.label?.length === 0 ? "updated" : "created"}`,
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
      )
      .finally(() => setIsSubmitting(false));
  };

  return (
    <>
      <TextInput
        w="100%"
        withAsterisk
        label="Label"
        defaultValue={editedOption.label}
        onChange={(event) =>
          setEditedOption((itemOption) => ({
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
        defaultValue={editedOption.modifiers?.map(({ id }) => id)}
        data={modifiers.map((modifier) => ({
          value: modifier.id,
          label: modifier.label,
        }))}
        onChange={(selectedIds) =>
          setEditedOption((itemOption) => ({
            ...itemOption,
            modifiers: modifiers.filter(({ id }) => selectedIds.includes(id)),
          }))
        }
        searchable
      />

      <Switch
        w="100%"
        label="Allow Multiple Selections"
        description="Turn off to force user to choose one option"
        withThumbIndicator={false}
        checked={itemOption.allow_multiple_selections}
        onChange={(event) =>
          setEditedOption((itemOption) => ({
            ...itemOption,
            allow_multiple_selections: event.target.checked,
          }))
        }
      />

      <Divider w="100%" />

      <Group gap="sm">
        <StyledButton variant="outline" label="Cancel" onClick={onClose} />

        <StyledButton
          label="Save"
          isLoading={isSubmitting}
          onClick={onUpsertOption}
        />
      </Group>
    </>
  );
}

export default UpsertOption;
