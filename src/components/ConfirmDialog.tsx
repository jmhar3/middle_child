import { Dialog, Group, Stack, Text } from "@mantine/core";

import StyledButton from "./StyledButton";

interface ConfirmDialogProps {
  confirmationMessage: string;
  onConfirm: () => void;
  onClose: () => void;
  isOpen: boolean;
}

function ConfirmDialog(props: ConfirmDialogProps) {
  const { isOpen, onClose, onConfirm, confirmationMessage } = props;

  return (
    <Dialog
      opened={isOpen}
      onClose={onClose}
      position={{ top: "sm", right: "sm" }}
    >
      <Stack>
        <Text ta="center" mb="sm" size="1.4em">
          {confirmationMessage}
        </Text>

        <Group grow>
          <StyledButton label="Confirm" onClick={onConfirm} />
          <StyledButton variant="outline" label="Cancel" onClick={onClose} />
        </Group>
      </Stack>
    </Dialog>
  );
}

export default ConfirmDialog;
