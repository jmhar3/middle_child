import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Badge } from "@mantine/core";
import { useMemo } from "react";

import type { OrderType } from "../../helpers/cart";

dayjs.extend(relativeTime);

function OrderBadge({ order }: { order: OrderType }) {
  const badgeColour = useMemo(() => {
    if (order.isComplete) return "gray";
    if (order.cancellationMessage) return "red";
    if (dayjs().isAfter(dayjs(order.dueAt))) return "red";
    if (dayjs().isBefore(dayjs(order.dueAt))) return "green";
    return "gray";
  }, [order]);

  const badgeLabel = useMemo(() => {
    if (order.isComplete) return "COMPLETE";
    if (order.cancellationMessage) return "CANCELLED";
    return dayjs(order.dueAt).fromNow();
  }, [order]);

  return (
    <Badge radius="sm" size="lg" color={badgeColour}>
      {badgeLabel}
    </Badge>
  );
}

export default OrderBadge;
