import { useState } from "react";
import { Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
// import { withAuthenticationRequired } from "@auth0/auth0-react";

import PageLayout from "./PageLayout";
import StyledButton from "../../components/StyledButton";
import OrdersList from "../../components/portal/OrdersList";
import UpdateStockDrawer from "../../components/portal/UpdateStockDrawer";
import ToggleStoreOpenModal from "../../components/portal/ToggleStoreOpenModal";

import { orderTimes, store } from "../../helpers/store";
import { mockOrders } from "../../helpers/cart";

import type { OrderTime } from "../../helpers/store";

function Orders() {
  const [storeInfo, setStoreInfo] = useState(store);

  const [
    showUpdateStockDrawer,
    { open: openUpdateStockDrawer, close: closeUpdateStockDrawer },
  ] = useDisclosure(false);
  const [
    showConfirmOpenDialog,
    { open: openConfirmOpenDialog, close: closeConfirmOpenDialog },
  ] = useDisclosure(false);

  const onSetOrderTime = (orderTime: OrderTime) => {
    setStoreInfo((prevStore) => ({
      ...prevStore,
      currentOrderTime: orderTime,
    }));
  };

  const onToggleStoreOpen = () => {
    closeConfirmOpenDialog();
    setStoreInfo((prevInfo) => ({
      ...prevInfo,
      isOpen: !prevInfo.isOpen,
    }));
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

  return (
    <PageLayout
      navComponents={
        <>
          <StyledButton
            variant="outline"
            label="Update Stock"
            onClick={openUpdateStockDrawer}
          />

          {storeInfo.isOpen && (
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

      <ToggleStoreOpenModal
        isOpen={storeInfo.isOpen}
        showConfirmationDialog={showConfirmOpenDialog}
        setShowConfirmationDialog={(isOpen) =>
          isOpen ? openConfirmOpenDialog() : closeConfirmOpenDialog()
        }
        onConfirmToggle={onToggleStoreOpen}
      />

      <Group w="100%" grow p="sm" bg="white" style={{ zIndex: -1 }}>
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

      <OrdersList orders={mockOrders} />
    </PageLayout>
  );
}

export default Orders;

// const ProtectedPortal = withAuthenticationRequired(Orders);

// export default ProtectedPortal;
