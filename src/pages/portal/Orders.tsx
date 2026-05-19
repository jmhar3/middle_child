import { useEffect, useState } from "react";
import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
// import { withAuthenticationRequired } from "@auth0/auth0-react";

import PageLayout from "./PageLayout";
import Loading from "../../components/Loading";
import StyledButton from "../../components/StyledButton";
import OrdersList from "../../components/portal/orders/OrdersList";
import UpdateStockDrawer from "../../components/portal/UpdateStockDrawer";
import ToggleStoreOpenModal from "../../components/portal/orders/ToggleStoreOpenModal";

import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { fetchMenu } from "../../state/menu/menuThunks";
import { fetchOrders } from "../../state/orders/ordersThunks";
import { fetchModifiers } from "../../state/modifiers/modifierThunks";
import { fetchOrderTimes } from "../../state/orderTimes/orderTimesThunks";
import { selectModifiersStatus } from "../../state/modifiers/modifiersSlice";
import { selectMenuStatus } from "../../state/menu/menuSlice";

import {
  fetchStoreInfo,
  updateStoreInfo,
} from "../../state/storeInfo/storeInfoThunks";

import {
  selectStoreInfo,
  selectStoreIsOpen,
} from "../../state/storeInfo/storeInfoSlice";

import {
  selectAllOrderTimes,
  selectOrderTimesStatus,
} from "../../state/orderTimes/orderTimesSlice";

import {
  selectOrders,
  selectOrdersStatus,
} from "../../state/orders/ordersSlice";

import type { OrderTime } from "../../state/types";
import dayjs from "dayjs";

function Orders() {
  const [isUpdatingOrderTime, setIsUpdatingOrderTime] = useState(false);

  const [
    showUpdateStockDrawer,
    { open: openUpdateStockDrawer, close: closeUpdateStockDrawer },
  ] = useDisclosure(false);
  const [
    showToggleStoreOpenModal,
    { open: openToggleStoreOpenModal, close: closeToggleStoreOpenModal },
  ] = useDisclosure(false);

  const dispatch = useAppDispatch();

  const menuStatus = useAppSelector(selectMenuStatus);
  const modifiersStatus = useAppSelector(selectModifiersStatus);
  const orderTimesStatus = useAppSelector(selectOrderTimesStatus);
  const storeInfoStatus = useAppSelector(selectModifiersStatus);
  const ordersStatus = useAppSelector(selectOrdersStatus);

  const orderTimes = useAppSelector(selectAllOrderTimes);
  const storeInfo = useAppSelector(selectStoreInfo);
  const storeIsOpen = useAppSelector(selectStoreIsOpen);
  const orders = useAppSelector(selectOrders);

  const isLoading =
    modifiersStatus === "pending" ||
    storeInfoStatus === "pending" ||
    orderTimesStatus === "pending" ||
    menuStatus === "pending" ||
    ordersStatus === "pending";

  useEffect(() => {
    if (menuStatus === "idle") {
      dispatch(fetchMenu());
    }
    if (modifiersStatus === "idle") {
      dispatch(fetchModifiers());
    }
    if (orderTimesStatus === "idle") {
      dispatch(fetchOrderTimes());
    }
    if (storeInfoStatus === "idle") {
      dispatch(fetchStoreInfo());
    }
    if (ordersStatus === "idle") {
      dispatch(fetchOrders());
    }
  }, [
    dispatch,
    menuStatus,
    modifiersStatus,
    orderTimesStatus,
    storeInfoStatus,
    ordersStatus,
  ]);

  const onUpdateCurrentOrderTime = (selectedOrderTime: OrderTime) => {
    setIsUpdatingOrderTime(true);
    dispatch(
      updateStoreInfo({ ...storeInfo, current_order_time: selectedOrderTime }),
    )
      .catch((error) =>
        notifications.show({
          message: error,
          withCloseButton: false,
          position: "bottom-right",
          color: "red",
        }),
      )
      .finally(() => {
        setIsUpdatingOrderTime(false);
      });
  };

  const weeklyTotal = Object.values(storeInfo.weekly_record).reduce(
    (acc, val) => acc + val,
    0,
  );

  const dayOfWeek = dayjs().format("dddd").toLowerCase() as
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";

  const todaysTotal = storeInfo.weekly_record[dayOfWeek];

  if (isLoading) return <Loading message="Loading store data" />;

  return (
    <PageLayout
      navComponents={
        <>
          <Stack gap="0">
            <Flex justify="space-between" gap="xs">
              <Text>Today:</Text>
              <Text>${todaysTotal}</Text>
            </Flex>
            <Flex justify="space-between" gap="xs">
              <Text>This Week:</Text>
              <Text>${weeklyTotal}</Text>
            </Flex>
          </Stack>
          <StyledButton
            variant="outline"
            label="Update Stock"
            onClick={openUpdateStockDrawer}
          />

          {storeIsOpen && (
            <StyledButton
              variant="outline"
              label="Close Store"
              onClick={openToggleStoreOpenModal}
            />
          )}
        </>
      }
    >
      <UpdateStockDrawer
        isOpen={showUpdateStockDrawer}
        onClose={closeUpdateStockDrawer}
      />

      {storeInfo && (
        <ToggleStoreOpenModal
          isOpen={showToggleStoreOpenModal}
          onClose={closeToggleStoreOpenModal}
        />
      )}

      {storeInfo && orderTimes && (
        <Box px="sm">
          <Group
            grow
            p="sm"
            w="100%"
            bdrs="sm"
            bg="white"
            style={{ zIndex: 0 }}
          >
            {orderTimes.map((orderTime) => (
              <StyledButton
                key={orderTime.label}
                label={`${orderTime.label}: ${orderTime.short}+ mins`}
                onClick={() => onUpdateCurrentOrderTime(orderTime)}
                isLoading={isUpdatingOrderTime}
                variant={
                  orderTime.id === storeInfo.current_order_time.id
                    ? "filled"
                    : "outline"
                }
              />
            ))}
          </Group>
        </Box>
      )}

      {storeIsOpen ? (
        orders && orders.length > 0 && <OrdersList orders={orders} />
      ) : (
        <Stack align="center" gap="sm" pt="3em">
          <Text ta="center" mb="sm" size="1.6em" fw="600">
            Middle Child is currently closed
          </Text>
          <StyledButton
            label="Start Accepting Orders"
            onClick={openToggleStoreOpenModal}
          />
        </Stack>
      )}
    </PageLayout>
  );
}

export default Orders;

// const ProtectedPortal = withAuthenticationRequired(Orders);

// export default ProtectedPortal;
