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
								{item.quantity} x {item.item.label}
							</Text>
							{item.modifiers && (
								<Text size="sm">
									{item.modifiers.map(({ label }) => label).join(", ")}
								</Text>
							)}

							{item.note && <Text>{item.note}</Text>}
						</Stack>

						<Text>
							$
							{(
								calculateOrderItemPrice(item.item, item.modifiers) *
								item.quantity
							).toFixed(2)}
						</Text>
					</Flex>
				</>
			))}
		</Stack>
	);
}

export default OrderSummary;
