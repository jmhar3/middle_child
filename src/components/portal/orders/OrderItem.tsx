import { useMemo, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Flex, Text, Stack, Badge, Button } from "@mantine/core";

import type { OrderItem as OrderItemType } from "../../../state/types";

dayjs.extend(relativeTime);

interface OrderItemProps {
	item: OrderItemType;
}

function OrderItem({ item: orderItem }: OrderItemProps) {
	const { id, quantity, item: menuItem, modifiers, note } = orderItem;

	const [showCode, setShowCode] = useState(true);

	const modifiersWithCode = modifiers?.map(
		({ reference_code }) => reference_code,
	);

	const modifiersWithCodeWithoutSize = useMemo(() => {
		return modifiersWithCode
			?.filter((code) => code !== null)
			.filter((code) => code !== "Large")
			.filter((code) => code !== "Small")
			.filter((code) => code !== "Full Cream");
	}, [modifiersWithCode]);

	const otherModifiers = useMemo(() => {
		const sugar = modifiers?.find((mod) =>
			mod.label.toLowerCase().includes("sugar"),
		);
		const sweetener = modifiers?.find((mod) =>
			mod.label.toLowerCase().includes("sweetener"),
		);
		const modifiersWithoutCodes = modifiers
			?.filter(({ reference_code }) => !reference_code)
			.filter(({ id }) => id !== sugar?.id)
			.filter(({ id }) => id !== sweetener?.id)
			?.map(({ label }) => label)
			.join(", ");

		if (sugar) {
			const numOfSugars = sugar.label.split(" ")[0];
			return modifiersWithoutCodes
				? `${numOfSugars}, ${modifiersWithoutCodes}`
				: numOfSugars;
		} else if (sweetener) {
			const numOfSweeteners = `${sweetener.label.split(" ")[0]}E`;
			return modifiersWithoutCodes
				? `${numOfSweeteners}, ${modifiersWithoutCodes}`
				: numOfSweeteners;
		}
		return modifiersWithoutCodes;
	}, [modifiers]);

	const code = useMemo(() => {
		if (modifiersWithCodeWithoutSize) {
			return modifiersWithCodeWithoutSize.join("") + menuItem.reference_code;
		}
		return menuItem.reference_code;
	}, [modifiersWithCodeWithoutSize, menuItem]);

	return (
		<Flex key={id} gap="sm" justify="space-between" align="center">
			<Stack gap="3">
				<Flex gap="sm" align="center">
					<Text fw="bold" size="lg">
						{quantity} x{" "}
					</Text>
					{menuItem.reference_code && showCode && (
						<Flex gap="sm" align="center">
							<Badge
								style={{ letterSpacing: "2px" }}
								radius="sm"
								size="xl"
								color={
									modifiersWithCode?.includes("Large") ? "darkgreen" : "purple"
								}
							>
								{code}
							</Badge>
							<Text fw="bold" size="lg">
								{otherModifiers}
							</Text>
						</Flex>
					)}

					{(menuItem.reference_code && !showCode) ||
						(!menuItem.reference_code && (
							<Text fw="bold" size="lg">
								{menuItem.label}
								{modifiers && " - "}
								{modifiers
									?.map(({ label }) =>
										label === "Full Cream" ? undefined : label,
									)
									.filter((label) => label)
									.join(", ")}
							</Text>
						))}
				</Flex>

				{note && <Text fs="italic">Note: {note}</Text>}
			</Stack>

			{menuItem.reference_code && (
				<Button
					py="0"
					size="md"
					variant="outline"
					color="darkslategray"
					onClick={() => setShowCode(!showCode)}
				>
					{showCode ? "Show Description" : "Show Code"}
				</Button>
			)}
		</Flex>
	);
}

export default OrderItem;
