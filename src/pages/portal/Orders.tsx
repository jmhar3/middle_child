import { useEffect, useState } from "react";
import { Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
// import { withAuthenticationRequired } from "@auth0/auth0-react";

import PageLayout from "./PageLayout";
import StyledButton from "../../components/StyledButton";
import OrdersList from "../../components/portal/orders/OrdersList";
import UpdateStockDrawer from "../../components/portal/UpdateStockDrawer";
import ToggleStoreOpenModal from "../../components/portal/ToggleStoreOpenModal";

import {
  fetchOrderTimes,
  fetchStoreData,
  updateStoreData,
} from "../../helpers/store";
import { mockOrders } from "../../helpers/cart";

import type { OrderTime, Store } from "../../helpers/store";
import Loading from "../../components/Loading";

function Orders() {
  const [
    showUpdateStockDrawer,
    { open: openUpdateStockDrawer, close: closeUpdateStockDrawer },
  ] = useDisclosure(false);
  const [
    showConfirmOpenDialog,
    { open: openConfirmOpenDialog, close: closeConfirmOpenDialog },
  ] = useDisclosure(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingOrderTime, setIsUpdatingOrderTime] = useState(false);
  const [storeInfo, setStoreInfo] = useState<Store>();
  const [orderTimes, setOrderTimes] = useState<OrderTime[]>();

  useEffect(() => {
    fetchOrderTimes()
      .then((data) => setOrderTimes(data))
      .catch((error) =>
        notifications.show({
          withCloseButton: false,
          message: error,
          position: "bottom-right",
          color: "red",
        }),
      )
      .finally(() => setIsLoading(false));
    fetchStoreData()
      .then((data) => setStoreInfo(data))
      .catch((error) =>
        notifications.show({
          withCloseButton: false,
          message: error,
          position: "bottom-right",
          color: "red",
        }),
      )
      .finally(() => setIsLoading(false));
  }, []);

  const onSetOrderTime = (orderTime: OrderTime) => {
    setIsUpdatingOrderTime(true);
    updateStoreData({ current_order_time: orderTime.id })
      .then(() =>
        notifications.show({
          withCloseButton: false,
          message: `Order time successfully updated to: ${orderTime.label}`,
          position: "bottom-right",
          color: "green",
        }),
      )
      .catch((error) =>
        notifications.show({
          withCloseButton: false,
          message: error,
          position: "bottom-right",
          color: "red",
        }),
      )
      .finally(() => setIsUpdatingOrderTime(false));
    setStoreInfo(
      (prevStoreInfo) =>
        prevStoreInfo && {
          ...prevStoreInfo,
          current_order_time: orderTime,
        },
    );
  };

  const onToggleStoreOpen = () => {
    closeConfirmOpenDialog();
    setStoreInfo(
      (prevStoreInfo) =>
        prevStoreInfo && {
          ...prevStoreInfo,
          is_open: !prevStoreInfo.is_open,
        },
    );
  };

  const onUpdateStock = () => {
    closeUpdateStockDrawer();
    notifications.show({
      withCloseButton: false,
      message: "Stock Updated Successfully",
      position: "bottom-right",
      color: "green",
    });
  };

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

          {storeInfo?.is_open && (
            <StyledButton
              variant="outline"
              label="Close Store"
              onClick={() => openConfirmOpenDialog()}
            />
          )}
        </>
      }
    >
      <UpdateStockDrawer
        isOpen={showUpdateStockDrawer}
        onClose={closeUpdateStockDrawer}
        onUpdateStock={onUpdateStock}
      />

      {storeInfo && (
        <ToggleStoreOpenModal
          isOpen={storeInfo.is_open}
          showConfirmationDialog={showConfirmOpenDialog}
          setShowConfirmationDialog={(isOpen) =>
            isOpen ? openConfirmOpenDialog() : closeConfirmOpenDialog()
          }
          onConfirmToggle={onToggleStoreOpen}
        />
      )}

      {storeInfo && orderTimes && (
        <Group w="100%" grow p="sm" bg="white" style={{ zIndex: 0 }}>
          {orderTimes.map((orderTime) => (
            <StyledButton
              key={orderTime.label}
              label={orderTime.label}
              onClick={() => onSetOrderTime(orderTime)}
              isLoading={isUpdatingOrderTime}
              variant={
                orderTime.id === storeInfo.current_order_time.id
                  ? "filled"
                  : "outline"
              }
            />
          ))}
        </Group>
      )}

      <OrdersList orders={mockOrders} />
    </PageLayout>
  );
}

export default Orders;

// const ProtectedPortal = withAuthenticationRequired(Orders);

// export default ProtectedPortal;
