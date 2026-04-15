import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Flex, Text, Stack, Divider } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import StyledButton from "../../StyledButton";
import OrderBadge from "./OrderBadge";
import OrderItem from "./OrderItem";

import type { OrderType } from "../../../state/types";
import { useAppDispatch } from "../../../state/hooks";
import { completeOrder } from "../../../state/orders/ordersThunks";
import { useState } from "react";

dayjs.extend(relativeTime);

interface OrderProps {
  order: OrderType;
}

function Order(props: OrderProps) {
  const { order } = props;

  const { user, items, note, is_complete } = order;

  const [isCompletingOrder, setIsCompletingOrder] = useState(false);

  const dispatch = useAppDispatch();

  const onCompleteOrder = () => {
    setIsCompletingOrder(true);
    dispatch(completeOrder(order.id))
      .catch((error) =>
        notifications.show({
          message: error,
          withCloseButton: false,
          position: "bottom-right",
          color: "red",
        }),
      )
      .finally(() => setIsCompletingOrder(true));
  };

  return (
    <Stack
      gap="0"
      bg="white"
      bdrs="sm"
      bd="solid 1px darkslategray"
      opacity={is_complete ? "50%" : "100%"}
    >
      <Flex
        w="100%"
        h="fit-content"
        align="center"
        justify="space-between"
        style={{ borderBottom: "solid 1px darkslategray" }}
      >
        <Flex pl="sm" py="8px" gap="sm" align="center">
          <OrderBadge order={order} />
          <Text fw="700" size="1.2em">
            {user.name}
          </Text>
        </Flex>

        <StyledButton
          radius="0"
          label="Complete Order"
          onClick={onCompleteOrder}
          isLoading={isCompletingOrder}
        />
      </Flex>

      <Stack p="sm" gap="xs">
        {items?.map((item, index) => (
          <>
            {index > 0 && <Divider w="100%" />}
            <OrderItem item={item} />
          </>
        ))}

        {note && (
          <>
            <Divider w="100%" />

            <Text fs="italic">{note}</Text>
          </>
        )}
      </Stack>
    </Stack>
  );
}

export default Order;
