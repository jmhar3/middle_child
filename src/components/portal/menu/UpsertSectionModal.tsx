import { Group, Modal, Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import { v4 as uuid } from "uuid";

import StyledButton from "../../StyledButton";

import type { MenuSection } from "../../../helpers/menu";

interface UpsertSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpsertSection: (section: MenuSection) => void;
  section?: MenuSection;
}

function UpsertSectionModal(props: UpsertSectionModalProps) {
  const { section, isOpen, onClose, onUpsertSection } = props;

  const [sectionLabel, setSectionLabel] = useState(
    section?.label.toUpperCase() || "",
  );

  return (
    <Modal
      centered
      radius="sm"
      opened={isOpen}
      onClose={onClose}
      title={section?.label ? "Rename Section" : "Create Section"}
      transitionProps={{ transition: "fade", duration: 200 }}
      styles={{
        content: { background: "whitesmoke" },
      }}
    >
      <Stack gap="md" align="center" pt="sm">
        <TextInput
          w="100%"
          size="md"
          withAsterisk
          label="Section Label"
          value={sectionLabel}
          onChange={(event) => setSectionLabel(event.target.value)}
        />

        <Group grow gap="sm" w="100%">
          <StyledButton label="Cancel" variant="outline" onClick={onClose} />

          <StyledButton
            label="Save"
            onClick={() =>
              onUpsertSection(
                section || { id: uuid(), label: sectionLabel, items: [] },
              )
            }
          />
        </Group>
      </Stack>
    </Modal>
  );
}

export default UpsertSectionModal;
