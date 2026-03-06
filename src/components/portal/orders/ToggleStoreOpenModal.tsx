import { Group, Modal, Overlay, Stack, Text } from "@mantine/core";

import StyledButton from "../../StyledButton";

interface ToggleStoreOpenModalProps {
  isOpen: boolean;
  onStoreOpenSuccess: () => void;
  showConfirmationDialog: boolean;
  setShowConfirmationDialog: (showConfirmation: boolean) => void;
}

function ToggleStoreOpenModal(props: ToggleStoreOpenModalProps) {
  const {
    isOpen,
    onStoreOpenSuccess,
    showConfirmationDialog,
    setShowConfirmationDialog,
  } = props;

  return (
    <>
      {(!isOpen || showConfirmationDialog) && (
        <Overlay color="darkslategray" backgroundOpacity={0.6} blur={3} />
      )}

      <Modal
        pt="6em"
        centered
        radius="sm"
        onClose={() => {}}
        withCloseButton={false}
        opened={!isOpen || showConfirmationDialog}
        transitionProps={{ transition: "fade", duration: 200 }}
        overlayProps={{
          opacity: 0,
          style: { pointerEvents: "none" },
        }}
        styles={{
          content: { background: "whitesmoke" },
        }}
      >
        <Stack>
          {showConfirmationDialog ? (
            <Text ta="center" mb="sm" size="1.6em" c="red.9" fw="600">
              {isOpen
                ? "Are you sure you want to stop accepting orders?"
                : "Are you sure you're ready to start accepting orders?"}
            </Text>
          ) : (
            <Text ta="center" mb="sm" size="1.6em" fw="600">
              Middle Child is currently closed
            </Text>
          )}

          <Group grow>
            {showConfirmationDialog ? (
              <>
                <StyledButton label="Confirm" onClick={onStoreOpenSuccess} />
                <StyledButton
                  label="Cancel"
                  variant="outline"
                  onClick={() => setShowConfirmationDialog(false)}
                />
              </>
            ) : (
              <StyledButton
                label="Start Accepting Orders"
                onClick={() => setShowConfirmationDialog(true)}
              />
            )}
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

export default ToggleStoreOpenModal;
