import { Divider, Flex, Stack, Text } from "@mantine/core";
import type { PendingOrderType } from "../../state/types";
import { calculateOrderItemPrice } from "../../helpers";

function OrderSummary({ order }: { order: PendingOrderType }) {
	return (
		<Stack gap="0">
			{order.items.map((item, index) => (
				<>
					{index > 0 && <Divider />}
					<Flex justify="space-between" align="center">
						<Stack gap="0" key={item.id} p="sm">
							<Text>
								{item.quantity} x {item.is_large ? "Large " : ""}
								{item.item.label}
							</Text>
							{item.modifiers && (
								<Text size="sm">
									{item.modifiers.map(({ label }) => label).join(", ")}
								</Text>
							)}

							{item.note && (
								<Text size="sm" fs="italic">
									{item.note}
								</Text>
							)}
						</Stack>

						<Text pr="sm">
							$
							{(
								calculateOrderItemPrice(
									item.item,
									item.modifiers,
									item.is_large,
								) * item.quantity
							).toFixed(2)}
						</Text>
					</Flex>
				</>
			))}

			{order.note && (
				<>
					<Divider />
					<Text size="sm" fs="italic">
						{order.note}
					</Text>
				</>
			)}
		</Stack>
	);
}

export default OrderSummary;
