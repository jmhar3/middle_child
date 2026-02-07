import { Button, Divider, Modal, Stack, Text } from "@mantine/core";
import { useAuth0 } from "@auth0/auth0-react";
import { useCounter } from "@mantine/hooks";
import { useMemo, useState } from "react";

import ButtonWithPrice from "./ButtonWithPrice";
import LoyaltyPoints from "./LoyaltyPoints";
import LoginButton from "../LoginButton";
import NoteInput from "./NoteInput";
import CartItem from "./CartItem";

import type { Cart, OrderItem } from "../../helpers/cart";
import MenuItemModal from "./MenuItemModal";

interface OrderListItem extends OrderItem {
  quantity: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Cart;
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

  const [quantity, { increment, decrement, reset }] = useCounter(
    pickUpTimeFromNow,
    { min: pickUpTimeFromNow },
  );

  const onModalClose = () => {
    reset();
    onClose();
  };

  const orderList: OrderListItem[] = useMemo(() => {
    const orderWithQuantities: OrderListItem[] = [];
    items.forEach((targetItem) => {
      const quantity = items.filter((item) => item === targetItem).length;
      orderWithQuantities.push({ ...targetItem, quantity: quantity });
    });
    return orderWithQuantities.filter((value, index) => {
      const _value = JSON.stringify(value);
      return (
        index ===
        orderWithQuantities.findIndex((obj) => {
          return JSON.stringify(obj) === _value;
        })
      );
    });
  }, [items]);

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
          onClose={() => setShowMenuItemModal(false)}
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
        opened={isOpen}
        onClose={onModalClose}
        title="CART"
        transitionProps={{ transition: "fade", duration: 200 }}
        styles={{
          header: { background: "whitesmoke" },
          content: { background: "whitesmoke" },
        }}
      >
        <Stack mih="100vh" align="center">
          <Stack w="100%">
            {!items && <Text>Your cart is empty.</Text>}
            {orderList?.map((orderItem, index) => (
              <>
                {index !== 0 && <Divider />}
                <CartItem
                  orderItem={orderItem}
                  onDeleteClick={() => onDeleteOrderItem(orderItem)}
                  onEditClick={() => setOldOrderItem(orderItem)}
                />
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
              disabled={quantity === pickUpTimeFromNow}
            >
              -
            </Button>
            <Button.GroupSection
              bg="white"
              color="darkslategray"
              variant="outline"
            >
              Pick Up in {quantity} Minutes
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
