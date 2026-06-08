import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Flex, Text, Stack, Badge } from "@mantine/core";

import type { OrderItem as OrderItemType } from "../../../state/types";

dayjs.extend(relativeTime);

interface OrderItemProps {
	item: OrderItemType;
}

function OrderItem({ item: orderItem }: OrderItemProps) {
	const { id, quantity, item: menuItem, modifiers, note } = orderItem;

	const modifierCodes = modifiers?.map(({ reference_code }) => reference_code);
	const modifiersWithoutCodes = modifiers?.filter(
		({ reference_code }) => !reference_code,
	);

	const code = modifierCodes
		? modifierCodes.filter((code) => code !== "Large").join("") +
			menuItem.reference_code
		: menuItem.reference_code;

	return (
		<Flex key={id} gap="sm" justify="space-between">
			<Stack gap="3">
				<Flex gap="sm" align="center">
					<Text>{quantity} x </Text>
					{menuItem.reference_code ? (
						<Flex gap="sm" align="center">
							<Badge
								style={{ letterSpacing: "2px" }}
								radius="sm"
								size="xl"
								color={
									modifierCodes?.includes("Large") ? "darkgreen" : "purple"
								}
							>
								{code}
							</Badge>
							{modifiersWithoutCodes && (
								<Text>
									{modifiersWithoutCodes.map(({ label }) => label).join(", ")}
								</Text>
							)}
						</Flex>
					) : (
						<Text>{menuItem.label}</Text>
					)}
				</Flex>

				{note && <Text fs="italic">Note: {note}</Text>}
			</Stack>

			<Text>
				{menuItem.label}
				{modifiers && ", "}
				{modifiers?.map(({ label }) => label).join(", ")}
			</Text>
		</Flex>
	);
}

export default OrderItem;
