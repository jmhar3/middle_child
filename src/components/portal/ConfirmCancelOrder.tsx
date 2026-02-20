import { useState } from "react";
import { Flex, TextInput } from "@mantine/core";

import StyledButton from "../StyledButton";

interface ConfirmCancelOrderProps {
  onAcceptOrder: () => void;
  onCancelOrder: (message: string) => void;
}

function ConfirmCancelOrder({
  onAcceptOrder,
  onCancelOrder,
}: ConfirmCancelOrderProps) {
  const [message, setMessage] = useState("");
  const [showCancelInput, setShowCancelInput] = useState(false);

  return showCancelInput ? (
    <Flex gap="0" align="center">
      <TextInput
        px="4px"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Reason for cancellation"
      />
      <StyledButton
        radius="0"
        label="Confirm Cancel Order"
        isDisabled={message.length === 0}
        onClick={() => {
          onCancelOrder(message);
          setShowCancelInput(false);
        }}
      />
    </Flex>
  ) : (
    <>
      <StyledButton
        radius="0"
        variant="transparent"
        label="Cancel Order"
        onClick={() => setShowCancelInput(true)}
      />
      <StyledButton radius="0" label="Accept Order" onClick={onAcceptOrder} />
    </>
  );
}

export default ConfirmCancelOrder;
