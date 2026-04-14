import { useMemo, useState } from "react";
import { Stack } from "@mantine/core";

import Order from "./Order";

import type { OrderType } from "../../../state/types";

interface OrdersProps {
  orders: OrderType[];
}

function OrdersList(props: OrdersProps) {
  const [orders, setOrders] = useState(props.orders);

  const sortedOrders = useMemo(() => {
    const incompleteOrders = orders.filter((order) => !order.is_complete);
    const completedOrders = orders.filter((order) => order.is_complete);
    return [...incompleteOrders, ...completedOrders];
  }, [orders]);

  const onCompleteOrder = (completedOrder: OrderType) =>
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === completedOrder.id
          ? { ...completedOrder, is_complete: true }
          : order,
      ),
    );

  return (
    <Stack w="100%" px="sm">
      {sortedOrders.map((order) => (
        <Order
          key={order.id}
          order={order}
          onCompleteOrder={() => onCompleteOrder(order)}
        />
      ))}
    </Stack>
  );
}

export default OrdersList;
