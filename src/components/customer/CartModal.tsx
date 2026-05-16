import { Button, Divider, Modal, Stack, Text } from "@mantine/core";
import { useCounter } from "@mantine/hooks";
import { useEffect, useMemo, useState } from "react";

import ButtonWithPrice from "./ButtonWithPrice";
import LoyaltyPoints from "./LoyaltyPoints";
import MenuItemModal from "../MenuItemModal";
import NoteInput from "./NoteInput";
import CartItem from "./CartItem";

import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { fetchUser } from "../../state/user/userThunks";
import { selectStoreInfo } from "../../state/storeInfo/storeInfoSlice";

import {
  selectUserLoyaltyPoints,
  selectUserStatus,
} from "../../state/user/userSlice";

import type { Cart, OrderItem } from "../../state/types";

interface CartModalProps {
  order: Omit<Cart, "pickUpTimeFromNow">;
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
    order: { total, items },
  } = props;
  const dispatch = useAppDispatch();
  const userStatus = useAppSelector(selectUserStatus);
  const loyaltyPoints = useAppSelector(selectUserLoyaltyPoints);
  const storeInfo = useAppSelector(selectStoreInfo);

  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(fetchUser());
    }
  }, [dispatch, userStatus]);

  const [note, setNote] = useState<string | undefined>();
  const [oldOrderItem, setOldOrderItem] = useState<OrderItem | undefined>();
  const [showMenuItemModal, setShowMenuItemModal] = useState(false);

  const additionalLoyaltyPoints = useMemo(() => {
    return items
      .filter((item) => item.item.is_applicable_loyalty_item)
      .map(({ quantity }) => quantity)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }, [items]);

  const pickUpTimeFromNow = useMemo(() => {
    const hasLongPrepTime = items.find(
      (orderItem) => orderItem.item.has_long_prep_time || false,
    );

    const numOfItems = items
      .map(({ quantity }) => quantity)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    if (hasLongPrepTime || numOfItems > 5) {
      return storeInfo.current_order_time.long;
    } else {
      return storeInfo.current_order_time.short;
    }
  }, [items, storeInfo]);

  const [pickUpTime, { increment, decrement, reset }] = useCounter(
    pickUpTimeFromNow,
    { min: pickUpTimeFromNow },
  );

  const onModalClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      {oldOrderItem && (
        <MenuItemModal
          isOpen={showMenuItemModal}
          onClose={() => {
            setOldOrderItem(undefined);
            setShowMenuItemModal(false);
          }}
          menuItem={oldOrderItem.item}
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
          <LoyaltyPoints
            existingPoints={loyaltyPoints}
            additionalPoints={additionalLoyaltyPoints}
          />

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
