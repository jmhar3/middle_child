import { useState } from "react";
// import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Group, Stack } from "@mantine/core";

import PageLayout from "./PageLayout";
import Order from "../../components/portal/Order";
import StyledButton from "../../components/StyledButton";
import ToggleStoreOpen from "../../components/portal/ToggleStoreOpen";

import { orderTimes, store, type OrderTime } from "../../helpers/store";
import { mockOrders } from "../../helpers/cart";

function Orders() {
  const [storeInfo, setStoreInfo] = useState(store);

  const onUpdateStockClick = () => {};

  const onSetOrderTime = (orderTime: OrderTime) => {
    setStoreInfo((prevStore) => ({
      ...prevStore,
      currentOrderTime: orderTime,
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

          <ToggleStoreOpen
            isOpen={storeInfo.isOpen}
            toggleStoreOpen={(isOpen: boolean) =>
              setStoreInfo((prevStore) => ({ ...prevStore, isOpen }))
            }
          />
        </>
      }
    >
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
