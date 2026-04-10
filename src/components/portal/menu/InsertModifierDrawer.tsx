import { useState } from "react";
import { v4 as uuid } from "uuid";

import { Text, Stack, Drawer, Divider } from "@mantine/core";

import UpsertModifier from "./UpsertModifier";

import type { Modifier } from "../../../state/modifiers/modifiersSlice";

interface InsertModifierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const blankModifier: Modifier = {
  id: uuid(),
  label: "",
  is_ingredient: false,
};

function InsertModifierDrawer(props: InsertModifierDrawerProps) {
  const { isOpen, onClose } = props;

  const [modifier, setModifier] = useState<Modifier>(blankModifier);

  const clearDrawer = () => {
    setModifier(blankModifier);
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
          ADD MODIFIER
        </Text>

        <Divider w="100%" />

        <UpsertModifier modifier={modifier} onClose={clearDrawer} />
      </Stack>
    </Drawer>
  );
}

export default InsertModifierDrawer;
