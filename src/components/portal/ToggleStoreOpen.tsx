import { useState } from "react";

import ConfirmDialog from "../ConfirmDialog";
import StyledButton from "../StyledButton";

interface ToggleStoreOpenProps {
  isOpen: boolean;
  toggleStoreOpen: (isOpen: boolean) => void;
}

function ToggleStoreOpen(props: ToggleStoreOpenProps) {
  const { isOpen, toggleStoreOpen } = props;

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  return (
    <>
      <StyledButton
        variant="outline"
        label={isOpen ? "Close Store" : "Open Store"}
        onClick={() => setIsConfirmationOpen(true)}
      />

      <ConfirmDialog
        confirmationMessage={
          isOpen
            ? "Are you sure you want to stop accepting orders?"
            : "Are you sure you want to start accepting orders?"
        }
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={() => {
          toggleStoreOpen(!isOpen);
          setIsConfirmationOpen(false);
        }}
      />
    </>
  );
}

export default ToggleStoreOpen;
