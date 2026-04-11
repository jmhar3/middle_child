import { useState } from "react";
import { Text, Stack, Select, Drawer, Divider } from "@mantine/core";

import StyledButton from "../../StyledButton";
import UpsertModifier from "./UpsertModifier";

import { useAppSelector } from "../../../state/hooks";
import { selectAllModifiers } from "../../../state/modifiers/modifiersSlice";

import type { Modifier } from "../../../state/modifiers/modifiersSlice";

interface UpdateModifierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function UpdateModifierDrawer(props: UpdateModifierDrawerProps) {
  const { isOpen, onClose } = props;

  const modifiers = useAppSelector(selectAllModifiers);
  const [modifier, setModifier] = useState<Modifier | undefined>();
  const [editModifier, setEditModifier] = useState(false);

  const clearDrawer = () => {
    setModifier(undefined);
    setEditModifier(false);
    onClose();
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
          EDIT MODIFIER
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
            disabled={editModifier}
            searchable
          />

          <StyledButton
            label="Edit Modifier"
            onClick={() => setEditModifier(true)}
            isDisabled={editModifier}
          />
        </Stack>

        {editModifier && modifier && (
          <>
            <Divider w="100%" />

            <UpsertModifier modifier={modifier} onClose={clearDrawer} />
          </>
        )}
      </Stack>
    </Drawer>
  );
}

export default UpdateModifierDrawer;
