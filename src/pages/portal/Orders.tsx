import { useEffect, useState } from "react";
import { Box, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
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

function Orders() {
  // handle dialog/drawer state
  const [
    showUpdateStockDrawer,
    { open: openUpdateStockDrawer, close: closeUpdateStockDrawer },
  ] = useDisclosure(false);
  const [
    showConfirmOpenDialog,
    { open: openConfirmOpenDialog, close: closeConfirmOpenDialog },
  ] = useDisclosure(false);

  // update order time loading state
  const [isUpdatingOrderTime, setIsUpdatingOrderTime] = useState(false);

  const dispatch = useAppDispatch();

  // store status
  const menuStatus = useAppSelector(selectMenuStatus);
  const modifiersStatus = useAppSelector(selectModifiersStatus);
  const orderTimesStatus = useAppSelector(selectOrderTimesStatus);
  const storeInfoStatus = useAppSelector(selectModifiersStatus);
  const ordersStatus = useAppSelector(selectOrdersStatus);

  // store data
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
    ).finally(() => {
      setIsUpdatingOrderTime(false);
    });
  };

  console.log(orders);

  if (isLoading) return <Loading message="Loading store data" />;

  return (
    <PageLayout
      navComponents={
        <>
          <StyledButton
            variant="outline"
            label="Update Stock"
            onClick={openUpdateStockDrawer}
          />

          {storeIsOpen && (
            <StyledButton
              variant="outline"
              label="Close Store"
              onClick={openConfirmOpenDialog}
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
          isOpen={storeInfo.is_open}
          showConfirmationDialog={showConfirmOpenDialog}
          setShowConfirmationDialog={(isOpen) =>
            isOpen ? openConfirmOpenDialog() : closeConfirmOpenDialog()
          }
          onStoreOpenSuccess={closeConfirmOpenDialog}
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
                label={orderTime.label}
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

      {orders && orders.length > 0 && <OrdersList orders={orders} />}
    </PageLayout>
  );
}

export default Orders;

// const ProtectedPortal = withAuthenticationRequired(Orders);

// export default ProtectedPortal;
