import { useEffect, useMemo, useState } from "react";
import { Button, Divider, Modal, Stack, Text, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useCounter } from "@mantine/hooks";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

import ButtonWithPrice from "./ButtonWithPrice";
import LoyaltyPoints from "./LoyaltyPoints";
import MenuItemModal from "../MenuItemModal";
import NoteInput from "./NoteInput";
import CartItem from "./CartItem";

import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { fetchUser } from "../../state/user/userThunks";
import { selectStoreInfo } from "../../state/storeInfo/storeInfoSlice";
import { placeOrder } from "../../state/orders/ordersThunks";

import {
  selectUser,
  selectUserStatus,
  selectUserLoyaltyPoints,
} from "../../state/user/userSlice";

import { calculateOrderItemPrice } from "../../helpers";

import type { OrderItem, OrderType } from "../../state/types";

interface CartModalProps {
  items: OrderItem[];
  isOpen: boolean;
  onClose: () => void;
  onEditOrderItem: (oldOrderItem: OrderItem, newOrderItem: OrderItem) => void;
  onDeleteOrderItem: (orderItem: OrderItem) => void;
  onSuccess: (order: OrderType) => void;
}

function CartModal(props: CartModalProps) {
  const {
    items,
    isOpen,
    onClose,
    onSuccess,
    onEditOrderItem,
    onDeleteOrderItem,
  } = props;

  const dispatch = useAppDispatch();
  const userStatus = useAppSelector(selectUserStatus);
  const user = useAppSelector(selectUser);
  const loyaltyPoints = useAppSelector(selectUserLoyaltyPoints);
  const storeInfo = useAppSelector(selectStoreInfo);

  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(fetchUser());
    }
  }, [dispatch, userStatus]);

  const [name, setName] = useState<string | undefined>();
  const [note, setNote] = useState<string | undefined>();
  const [showNameError, setShowNameError] = useState(false);
  const [oldOrderItem, setOldOrderItem] = useState<OrderItem | undefined>();
  const [showMenuItemModal, setShowMenuItemModal] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const applicableLoyaltyItems = useMemo(() => {
    return items.filter((item) => item.item.is_applicable_loyalty_item);
  }, [items]);

  const additionalLoyaltyPoints = useMemo(() => {
    return applicableLoyaltyItems
      .map(({ quantity }) => quantity)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }, [applicableLoyaltyItems]);

  const pointsTotal = (loyaltyPoints || 0) + additionalLoyaltyPoints;

  const freeItem = useMemo(() => {
    if (pointsTotal >= 12) {
      let quantity = loyaltyPoints || 0;
      for (const item of applicableLoyaltyItems) {
        if (quantity + item.quantity >= 12) {
          return item;
        }
        quantity += item.quantity;
      }
    }
    return null;
  }, [pointsTotal, loyaltyPoints, applicableLoyaltyItems]);

  const orderTotal = useMemo(() => {
    return items
      .map((item) => {
        if (freeItem?.id === item.id) {
          if (item.quantity === 1) return 0;
          return (
            calculateOrderItemPrice(item.item, item.modifiers) *
            (item.quantity - 1)
          );
        }
        return (
          calculateOrderItemPrice(item.item, item.modifiers) * item.quantity
        );
      })
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }, [items, freeItem]);

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

  const order: OrderType = {
    id: "1",
    items: items,
    total: orderTotal,
    due_at: dayjs().add(pickUpTime, "minute").toISOString(),
    is_complete: false,
  };

  const onModalClose = () => {
    reset();
    setShowNameError(false);
    onClose();
  };

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);
    setShowNameError(false);

    if (!user && !name) {
      setShowNameError(true);
      setIsPlacingOrder(false);
      return;
    }

    dispatch(
      placeOrder({
        name: user?.name || name,
        userId: user?.id,
        orderData: order,
        new_loyalty_points_total: freeItem ? pointsTotal - 12 : pointsTotal,
      }),
    )
      .then(() => {
        onSuccess(order);
        onClose();
      })
      .catch((error) =>
        notifications.show({
          message: error,
          withCloseButton: false,
          position: "bottom-right",
          color: "red",
        }),
      )
      .finally(() => setIsPlacingOrder(false));
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

          {!user && (
            <TextInput
              w="100%"
              label="Name"
              value={name}
              withAsterisk
              error={showNameError && "Name is required"}
              onChange={(e) => {
                if (e.target.value.length > 0) setShowNameError(false);
                setName(e.target.value);
              }}
              styles={{
                input: {
                  borderRadius: "sm",
                  border: showNameError
                    ? "crimson solid 1px"
                    : "darkslategray solid 1px",
                },
              }}
            />
          )}

          <Stack w="100%">
            {!items && <Text>Your cart is empty.</Text>}
            {items?.map((orderItem, index) => (
              <>
                {index === 0 && <Divider />}
                <CartItem
                  isFreeItem={orderItem.id === freeItem?.id}
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
              isLoading={isPlacingOrder}
              onClick={onPlaceOrder}
              label="Order Now"
              price={orderTotal}
            />
            <Text>Pay securely using Square</Text>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
}

export default CartModal;
