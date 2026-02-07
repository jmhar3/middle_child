import { Button, Divider, Modal, Stack, Text } from "@mantine/core";
import { useAuth0 } from "@auth0/auth0-react";
import { useCounter } from "@mantine/hooks";
import { useMemo, useState } from "react";

import ButtonWithPrice from "./ButtonWithPrice";
import LoyaltyPoints from "./LoyaltyPoints";
import MenuItemModal from "./MenuItemModal";
import LoginButton from "../LoginButton";
import NoteInput from "./NoteInput";
import CartItem from "./CartItem";

import type { Cart, OrderItem } from "../../helpers/cart";

interface CartModalProps {
  order: Cart;
  isOpen: boolean;
  onClose: () => void;
  onEditOrderItem: (oldOrderItem: OrderItem, newOrderItem: OrderItem) => void;
  onDeleteOrderItem: (orderItem: OrderItem) => void;
}

function CartModal(props: CartModalProps) {
  const {
    isOpen,
    onClose,
    onEditOrderItem,
    onDeleteOrderItem,
    order: { total, items, pickUpTimeFromNow },
  } = props;

  const { isAuthenticated } = useAuth0();

  const [note, setNote] = useState<string | undefined>();
  const [oldOrderItem, setOldOrderItem] = useState<OrderItem | undefined>();
  const [showMenuItemModal, setShowMenuItemModal] = useState(false);

  const [pickUpTime, { increment, decrement, reset }] = useCounter(
    pickUpTimeFromNow,
    { min: pickUpTimeFromNow },
  );

  const onModalClose = () => {
    reset();
    onClose();
  };

  const additionalLoyaltyPoints = useMemo(
    () => items.filter((item) => item.menuItem.isLoyaltyApplicable).length,
    [items],
  );

  const onClaimFreeCoffee = () => {};

  return (
    <>
      {oldOrderItem && (
        <MenuItemModal
          isOpen={showMenuItemModal}
          onClose={() => {
            setOldOrderItem(undefined);
            setShowMenuItemModal(false);
          }}
          menuItem={oldOrderItem.menuItem}
          orderItem={oldOrderItem}
          onAddToOrder={(newOrderItem: OrderItem) =>
            onEditOrderItem(oldOrderItem, newOrderItem)
          }
        />
      )}

      <Modal
        fullScreen
        radius={0}
        title="CART"
        opened={isOpen}
        onClose={onModalClose}
        transitionProps={{ transition: "fade", duration: 200 }}
        styles={{
          header: { background: "whitesmoke" },
          content: { background: "whitesmoke" },
        }}
      >
        <Stack mih="100%" align="center">
          <Stack w="100%">
            {!items && <Text>Your cart is empty.</Text>}
            {items?.map((orderItem, index) => (
              <>
                {index === 0 && <Divider />}
                <CartItem
                  orderItem={orderItem}
                  onDeleteClick={() => onDeleteOrderItem(orderItem)}
                  onEditClick={() => {
                    setOldOrderItem(orderItem);
                    setShowMenuItemModal(true);
                  }}
                />
                <Divider />
              </>
            ))}
          </Stack>

          <NoteInput label="Notes" note={note} setNote={setNote} />

          <Button.Group>
            <Button
              radius="md"
              variant="filled"
              color="darkslategray"
              onClick={decrement}
              disabled={pickUpTime === pickUpTimeFromNow}
            >
              -
            </Button>
            <Button.GroupSection
              bg="white"
              color="darkslategray"
              variant="outline"
            >
              Pick Up in {pickUpTime} Minutes
            </Button.GroupSection>
            <Button
              radius="md"
              variant="filled"
              color="darkslategray"
              onClick={increment}
            >
              +
            </Button>
          </Button.Group>

          {isAuthenticated ? (
            <LoyaltyPoints
              additionalPoints={additionalLoyaltyPoints}
              onClaimFreeCoffee={onClaimFreeCoffee}
            />
          ) : (
            <LoginButton />
          )}

          <Stack gap="3" w="100%" align="center">
            <ButtonWithPrice
              onClick={() => ""}
              label="Order Now"
              price={total}
            />
            <Text>Pay securely using Square</Text>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
}

export default CartModal;
