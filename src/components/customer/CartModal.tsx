import LoginButton from "../LoginButton";

import type { Cart } from "../../helpers/cart";
import { Button, Modal, Stack, Text } from "@mantine/core";

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
            {items?.map((orderItem) => (
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

                <Text>${orderItem.totalPrice.toFixed(2)}</Text>
              </Stack>
            ))}
          </Stack>

          <Button>Order Now ${total.toFixed(2)}</Button>
          <Text>Pay securely using Square</Text>
        </Stack>
      </Stack>
    </Modal>
  );
}

export default SignInModal;
