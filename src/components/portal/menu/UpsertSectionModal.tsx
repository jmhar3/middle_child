import { Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { v4 as uuid } from "uuid";

import StyledButton from "../../StyledButton";

import { selectMenuLength, type Section } from "../../../state/menu/menuSlice";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { upsertSection } from "../../../state/menu/menuThunks";
import { notifications } from "@mantine/notifications";

interface UpsertSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  section?: Section;
}

function UpsertSectionModal(props: UpsertSectionModalProps) {
  const { section, isOpen, onClose } = props;

  const dispatch = useAppDispatch();
  const menuLength = useAppSelector(selectMenuLength);

  const [isUpdatingSection, setIsUpdatingSection] = useState(false);
  const [sectionLabelInput, setSectionLabelInput] = useState(
    section?.label.toUpperCase() || "",
  );

  const onCloseModal = () => {
    setSectionLabelInput(section?.label.toUpperCase() || "");
    onClose();
  };

  const onUpsertSection = () => {
    const sectionData = {
      id: section?.id || uuid(),
      order: section?.order || menuLength + 1,
      label: sectionLabelInput,
    };

    setIsUpdatingSection(true);

    dispatch(upsertSection(sectionData))
      .then(() => {
        notifications.show({
          withCloseButton: false,
          message: `${sectionLabelInput} successfully ${section ? "renamed" : "created"}`,
          position: "bottom-right",
          color: "green",
        });
      })
      .catch((error) =>
        notifications.show({
          message: error,
          withCloseButton: false,
          position: "bottom-right",
          color: "red",
        }),
      )
      .finally(() => setIsUpdatingSection(false));
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
          value={sectionLabelInput}
          onChange={(event) => setSectionLabelInput(event.target.value)}
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
