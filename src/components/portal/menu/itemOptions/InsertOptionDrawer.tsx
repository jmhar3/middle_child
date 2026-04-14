import { v4 as uuid } from "uuid";
import { Text, Stack, Drawer, Divider } from "@mantine/core";

import UpsertOption from "./UpsertOption";

import type { ItemOptions } from "../../../../state/types";

interface InsertOptionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const blankOption: ItemOptions = {
  id: uuid(),
  label: "",
  modifiers: [],
  allow_multiple_selections: true,
  is_required: false,
};

function InsertOptionDrawer(props: InsertOptionDrawerProps) {
  const { isOpen, onClose } = props;

  return (
    <Drawer
      offset={12}
      radius="sm"
      position="right"
      opened={isOpen}
      onClose={onClose}
      withCloseButton={false}
      trapFocus={false}
    >
      <Stack align="flex-end">
        <Text size="1.4em" fw="600" ta="left" w="100%">
          ADD OPTION
        </Text>

        <Divider w="100%" />

        <UpsertOption itemOption={blankOption} onClose={onClose} />
      </Stack>
    </Drawer>
  );
}

export default InsertOptionDrawer;
