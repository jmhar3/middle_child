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
    const incompleteOrders = orders.filter((order) => !order.isComplete);
    const completedOrders = orders.filter((order) => order.isComplete);
    return [...incompleteOrders, ...completedOrders];
  }, [orders]);

  const onCompleteOrder = (completedOrder: OrderType) =>
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === completedOrder.id
          ? { ...completedOrder, isComplete: true }
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
