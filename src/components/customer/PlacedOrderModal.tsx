import { Button, Divider, Modal, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

import type { OrderType } from "../../state/types";

interface PlacedOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderType;
}

function PlacedOrderModal(props: PlacedOrderModalProps) {
  const {
    isOpen,
    onClose,
    order: { items },
  } = props;

  return (
    <Modal
      fullScreen
      radius={0}
      title="ORDER SUCCESSFUL"
      opened={isOpen}
      onClose={onClose}
      transitionProps={{ transition: "fade", duration: 200 }}
      styles={{
        header: { background: "whitesmoke" },
        content: { background: "whitesmoke" },
      }}
    >
      <Stack>
        <Divider w="100%" />

        <Stack gap="xs" align="center">
          <Text>Thanks for ordering with Middle Child</Text>

          <Text>
            Your order will be ready at{" "}
            {dayjs(props.order.due_at).format("h:mma")}
          </Text>
        </Stack>

        <Divider w="100%" />

        <Stack gap="xs">
          {items.map((item, index) => (
            <>
              {index > 0 && <Divider w="100%" />}

              <Stack key={item.id} gap="xs">
                <Text>
                  {item.quantity} x {item.item.label}
                </Text>
                <Text>{item.modifiers?.join(", ")}</Text>
              </Stack>
            </>
          ))}
        </Stack>

        <Button color="darkslategray" onClick={onClose}>
          Close
        </Button>
      </Stack>
    </Modal>
  );
}

export default PlacedOrderModal;
