import { Group, Modal, Stack, Text } from "@mantine/core";
import StyledButton from "./StyledButton";

interface ConfirmationModalProps {
  label: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
}

function ConfirmationModal(props: ConfirmationModalProps) {
  const { label, isOpen, onClose, onConfirmDelete } = props;

  return (
    <Modal
      centered
      radius="sm"
      opened={isOpen}
      onClose={onClose}
      withCloseButton={false}
      transitionProps={{ transition: "fade", duration: 200 }}
      styles={{
        content: { background: "whitesmoke" },
      }}
    >
      <Stack gap="md" align="center">
        <Text ta="center" size="1.4em" fw="600">
          Are you sure you want to delete {label}?
        </Text>

        <Group grow gap="sm" w="100%">
          <StyledButton label="Cancel" variant="outline" onClick={onClose} />

          <StyledButton label="Confirm" onClick={onConfirmDelete} />
        </Group>
      </Stack>
    </Modal>
  );
}

export default ConfirmationModal;
