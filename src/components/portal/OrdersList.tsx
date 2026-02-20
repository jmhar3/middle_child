import { useMemo, useState } from "react";
import { Stack } from "@mantine/core";

import Order from "./Order";

import type { OrderType } from "../../helpers/cart";

interface OrdersProps {
  orders: OrderType[];
}

function OrdersList(props: OrdersProps) {
  const [orders, setOrders] = useState(props.orders);

  const sortedOrders = useMemo(() => {
    const unconfirmedOrders = orders.filter(
      (order) => order.isAccepted === undefined,
    );
    const confirmedOrders = orders.filter(
      (order) => order.isAccepted === true && !order.isComplete,
    );
    const completedOrders = orders.filter((order) => order.isComplete);
    const cancelledOrders = orders.filter((order) => order.cancellationMessage);

    return [
      ...unconfirmedOrders,
      ...confirmedOrders,
      ...completedOrders,
      ...cancelledOrders,
    ];
  }, [orders]);

  const updateOrder = (newOrder: OrderType) =>
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === newOrder.id ? newOrder : order)),
    );

  return (
    <Stack w="100%" px="sm">
      {sortedOrders.map((order) => (
        <Order key={order.id} order={order} updateOrder={updateOrder} />
      ))}
    </Stack>
  );
}

export default OrdersList;
