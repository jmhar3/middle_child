import { useMemo, useState } from "react";
import { Badge } from "@mantine/core";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import type { PlacedOrderType } from "../../../state/types";

dayjs.extend(relativeTime);

function OrderBadge(order: PlacedOrderType) {
	const [dueAt, setDueAt] = useState(dayjs(order.due_at).fromNow());

	const updateDueAt = () => setDueAt(dayjs(order.due_at).fromNow());

	setInterval(updateDueAt, 10000);

	const badgeColour = useMemo(() => {
		if (order.is_complete) return "gray";
		if (dayjs().isAfter(dueAt)) return "red";
		if (dayjs().isBefore(dueAt)) return "green";
		return "gray";
	}, [dueAt, order.is_complete]);

	return (
		<Badge radius="sm" size="xl" color={badgeColour}>
			{order.is_complete ? "COMPLETE" : dueAt}
		</Badge>
	);
}

export default OrderBadge;
