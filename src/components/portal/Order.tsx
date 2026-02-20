import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Flex, Text, Stack, Badge, Divider } from "@mantine/core";

import ConfirmCancelOrder from "./ConfirmCancelOrder";
import StyledButton from "../StyledButton";

import type { OrderType } from "../../helpers/cart";
import OrderBadge from "./OrderBadge";

dayjs.extend(relativeTime);

interface OrderProps {
  order: OrderType;
  updateOrder: (order: OrderType) => void;
}

function Order(props: OrderProps) {
  const { order, updateOrder } = props;

  const {
    user,
    items,
    notes,
    isAccepted,
    isComplete,
    isReadyToCollect,
    cancellationMessage,
  } = order;

  const onAcceptOrder = () => {
    updateOrder({ ...order, isAccepted: true });
  };

  const onCancelOrder = (message: string) => {
    updateOrder({ ...order, isAccepted: false, cancellationMessage: message });
  };

  const onReadyToCollect = () => {
    updateOrder({ ...order, isReadyToCollect: true });
  };

  const onComplete = () => {
    updateOrder({ ...order, isReadyToCollect: true, isComplete: true });
  };

  return (
    <Stack
      gap="0"
      bg="white"
      bdrs="sm"
      bd="solid 1px darkslategray"
      opacity={cancellationMessage || isComplete ? "50%" : "100%"}
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

        <Flex style={{ borderLeft: "solid 1px darkslategray" }}>
          {isAccepted === undefined && (
            <ConfirmCancelOrder
              onAcceptOrder={onAcceptOrder}
              onCancelOrder={onCancelOrder}
            />
          )}
          {isAccepted && !isReadyToCollect && (
            <StyledButton
              radius="0"
              variant="transparent"
              label="Ready To Collect"
              onClick={onReadyToCollect}
            />
          )}
          {isAccepted && !isComplete && (
            <StyledButton
              radius="0"
              label="Complete Order"
              onClick={onComplete}
            />
          )}
        </Flex>
      </Flex>

      <Stack p="sm" gap="xs">
        {items.map((item, index) => (
          <>
            {index > 0 && <Divider w="100%" />}
            <Flex key={item.id} gap="sm" justify="space-between">
              <Stack gap="0">
                <Text>
                  {item.quantity} x {item.menuItem.label}
                </Text>
                <Text fs="italic">{item.note}</Text>
              </Stack>
              <Flex gap="sm">
                {item.modifiers.map((modifier) => (
                  <Badge
                    radius="sm"
                    size="lg"
                    color={modifier.color}
                    key={modifier.id}
                  >
                    {modifier.label}
                  </Badge>
                ))}
              </Flex>
            </Flex>
          </>
        ))}

        {notes && (
          <>
            <Divider w="100%" />

            <Text fs="italic">{notes}</Text>
          </>
        )}
      </Stack>
    </Stack>
  );
}

export default Order;
