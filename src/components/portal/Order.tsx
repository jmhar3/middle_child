import { useState } from "react";
import { Flex, Text, Stack, Badge, Divider } from "@mantine/core";
import relativeTime from "dayjs/plugin/relativeTime";

import ConfirmCancelOrder from "./ConfirmCancelOrder";

import type { OrderType } from "../../helpers/cart";
import StyledButton from "../StyledButton";
import dayjs from "dayjs";

dayjs.extend(relativeTime);

interface OrderProps {
  order: OrderType;
}

function Order(props: OrderProps) {
  const [order, setOrder] = useState(props.order);

  const {
    user,
    dueAt,
    items,
    notes,
    isAccepted,
    isReadyToCollect,
    isComplete,
  } = order;

  const onAcceptOrder = () => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      isAccepted: true,
    }));
  };

  const onCancelOrder = (message: string) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      isAccepted: false,
      cancellationMessage: message,
    }));
  };

  const onReadyToCollect = () => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      isReadyToCollect: true,
    }));
  };

  const onComplete = () => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      isComplete: true,
    }));
  };

  return (
    <Stack bg="white" bdrs="sm" bd="solid 1px darkslategray">
      <Flex
        w="100%"
        h="fit-content"
        align="center"
        justify="space-between"
        style={{ borderBottom: "solid 1px darkslategray" }}
      >
        <Flex p="sm" gap="sm" align="center">
          <Badge
            radius="sm"
            size="lg"
            color={dayjs().isBefore(dayjs(dueAt)) ? "green" : "red"}
          >
            {dayjs(dueAt).fromNow()}
          </Badge>
          <Text fw="700" size="1.4em">
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
              variant="outline"
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

      <Stack p="sm" pt="0">
        {items.map((item, index) => (
          <>
            {index > 0 && <Divider w="100%" />}
            <Flex gap="sm" justify="space-between">
              <Stack gap="0">
                <Text>
                  {item.quantity} x {item.menuItem.label}
                </Text>
                <Text fs="italic">{item.note}</Text>
              </Stack>
              <Flex gap="sm">
                {item.modifiers.map((modifier) => (
                  <Badge radius="sm" size="lg" key={modifier.id}>
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
