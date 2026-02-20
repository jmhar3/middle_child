import { useState } from "react";
import { Group, Stack } from "@mantine/core";
// import { withAuthenticationRequired } from "@auth0/auth0-react";

import PageLayout from "./PageLayout";
import Order from "../../components/portal/Order";
import StyledButton from "../../components/StyledButton";
import ToggleStoreOpenModal from "../../components/portal/ToggleStoreOpenModal";

import { orderTimes, store } from "../../helpers/store";
import { mockOrders } from "../../helpers/cart";

import type { OrderTime } from "../../helpers/store";

function Orders() {
  const [storeInfo, setStoreInfo] = useState(store);
  const [showConfirmOpenDialog, setShowConfirmOpenDialog] = useState(false);

  const onUpdateStockClick = () => {};

  const onSetOrderTime = (orderTime: OrderTime) => {
    setStoreInfo((prevStore) => ({
      ...prevStore,
      currentOrderTime: orderTime,
    }));
  };

  const onToggleStoreOpen = () => {
    setShowConfirmOpenDialog(false);
    setStoreInfo((prevInfo) => ({
      ...prevInfo,
      isOpen: !prevInfo.isOpen,
    }));
  };

  return (
    <PageLayout
      navComponents={
        <>
          <StyledButton
            variant="outline"
            label="Update Stock"
            onClick={onUpdateStockClick}
          />

          {storeInfo.isOpen && (
            <StyledButton
              variant="outline"
              label="Close Store"
              onClick={() => setShowConfirmOpenDialog(true)}
            />
          )}
        </>
      }
    >
      <ToggleStoreOpenModal
        isOpen={storeInfo.isOpen}
        showConfirmationDialog={showConfirmOpenDialog}
        setShowConfirmationDialog={(isOpen) => setShowConfirmOpenDialog(isOpen)}
        onConfirmToggle={onToggleStoreOpen}
      />

      <Group w="100%" grow p="sm" bg="white">
        {orderTimes.map((orderTime) => (
          <StyledButton
            key={orderTime.label}
            label={orderTime.label}
            onClick={() => onSetOrderTime(orderTime)}
            variant={
              orderTime === storeInfo.currentOrderTime ? "filled" : "outline"
            }
          />
        ))}
      </Group>

      <Stack w="100%" px="sm">
        {mockOrders.map(
          (order) =>
            !order.cancellationMessage && (
              <Order key={order.id} order={order} />
            ),
        )}
      </Stack>
    </PageLayout>
  );
}

export default Orders;

// const ProtectedPortal = withAuthenticationRequired(Orders);

// export default ProtectedPortal;
