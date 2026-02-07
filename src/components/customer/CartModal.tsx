import LoginButton from "../LoginButton";

import { calculateOrderItemPrice, type Cart } from "../../helpers/cart";
import { Button, Modal, Stack, Text, Textarea } from "@mantine/core";
import { useState } from "react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Cart;
}

function SignInModal(props: SignInModalProps) {
  const {
    onClose,
    isOpen,
    order: { total, items },
  } = props;

  const [note, setNote] = useState<string | undefined>(undefined);

  return (
    <Modal
      fullScreen
      radius={0}
      opened={isOpen}
      onClose={onClose}
      transitionProps={{ transition: "fade", duration: 200 }}
    >
      <Stack mih="100vh">
        <Stack gap={1} p={2} pt={6}>
          <LoginButton />

          <Stack>
            {!items && <Text>Your cart is empty.</Text>}
            {items?.map((orderItem) => {
              const orderItemPrice = calculateOrderItemPrice(
                orderItem.menuItem,
                orderItem.modifiers,
              );
              return (
                <Stack
                  key={orderItem.menuItem.label}
                  dir="row"
                  justify="space-between"
                >
                  <Stack>
                    <Text>{orderItem.menuItem.label}</Text>
                    <Stack dir="row">
                      {orderItem.modifiers?.map((modifier) => (
                        <Text key={modifier.label}>{modifier.label}</Text>
                      ))}
                    </Stack>
                  </Stack>

                  <Text>${orderItemPrice.toFixed(2)}</Text>
                </Stack>
              );
            })}
          </Stack>

          <Textarea value={note} onChange={(e) => setNote(e.target.value)} />

          <Button>Order Now ${total.toFixed(2)}</Button>
          <Text>Pay securely using Square</Text>
        </Stack>
      </Stack>
    </Modal>
  );
}

export default SignInModal;
