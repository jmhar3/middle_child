import { Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { v4 as uuid } from "uuid";

import StyledButton from "../../StyledButton";

import { menu, upsertSection, type MenuSection } from "../../../helpers/menu";
import { notifications } from "@mantine/notifications";

interface UpsertSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSectionUpsert: (section: MenuSection) => void;
  section?: MenuSection;
}

function UpsertSectionModal(props: UpsertSectionModalProps) {
  const { section, isOpen, onClose, onSectionUpsert } = props;

  const [isUpdatingSection, setIsUpdatingSection] = useState(false);
  const [sectionLabel, setSectionLabel] = useState(
    section?.label.toUpperCase() || "",
  );

  const onCloseModal = () => {
    setSectionLabel(section?.label.toUpperCase() || "");
    onClose();
  };

  const onUpsertSection = () => {
    const sectionData = section
      ? { ...section, label: sectionLabel }
      : {
          id: uuid(),
          order: menu.length + 1,
          label: sectionLabel,
          items: [],
        };

    setIsUpdatingSection(true);

    upsertSection(sectionData)
      .then(() =>
        notifications.show({
          withCloseButton: false,
          message: section
            ? `${section.label} successfully updated to: ${sectionLabel}`
            : `${sectionLabel} successfully created`,
          position: "bottom-right",
          color: "green",
        }),
      )
      .catch((error) =>
        notifications.show({
          withCloseButton: false,
          message: error,
          position: "bottom-right",
          color: "red",
        }),
      )
      .finally(() => {
        if (!section) setSectionLabel("");
        setIsUpdatingSection(false);
        onSectionUpsert(sectionData);
      });
  };

  return (
    <Modal
      centered
      radius="sm"
      opened={isOpen}
      onClose={onCloseModal}
      withCloseButton={false}
      transitionProps={{ transition: "fade", duration: 200 }}
      styles={{
        content: { background: "whitesmoke" },
      }}
    >
      <Stack gap="md" align="flex-start">
        <Text fw="600" size="1.4em">
          {section?.label ? "RENAME SECTION" : "CREATE SECTION"}
        </Text>

        <TextInput
          w="100%"
          size="md"
          withAsterisk
          label="Section Label"
          value={sectionLabel}
          onChange={(event) => setSectionLabel(event.target.value)}
        />

        <Group grow gap="sm" w="100%">
          <StyledButton
            label="Cancel"
            variant="outline"
            onClick={onCloseModal}
            isLoading={isUpdatingSection}
          />

          <StyledButton
            label="Save"
            onClick={onUpsertSection}
            isLoading={isUpdatingSection}
          />
        </Group>
      </Stack>
    </Modal>
  );
}

export default UpsertSectionModal;
