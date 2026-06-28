import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Badge } from "@mantine/core";
import { useMemo } from "react";

import type { PlacedOrderType } from "../../../state/types";

dayjs.extend(relativeTime);

function OrderBadge({ order }: { order: PlacedOrderType }) {
	const badgeColour = useMemo(() => {
		if (order.is_complete) return "gray";
		if (dayjs().isAfter(dayjs(order.due_at))) return "red";
		if (dayjs().isBefore(dayjs(order.due_at))) return "green";
		return "gray";
	}, [order]);

	const badgeLabel = useMemo(() => {
		if (order.is_complete) return "COMPLETE";
		return dayjs(order.due_at).fromNow();
	}, [order]);

	return (
		<Badge radius="sm" size="xl" color={badgeColour}>
			{badgeLabel}
		</Badge>
	);
}

export default OrderBadge;
