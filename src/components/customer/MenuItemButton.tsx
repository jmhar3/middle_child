import { useMemo } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { Button, em, ScrollArea, Stack, Text } from "@mantine/core";

import { calculateOrderItemPrice } from "../../helpers";

import type { MenuItemType, Modifier } from "../../state/types";

interface MenuItemButtonProps {
	onClick: () => void;
	item: MenuItemType;
	note?: string;
	modifiers?: Modifier[];
	isPrevOrder?: boolean;
}

function MenuItemButton(props: MenuItemButtonProps) {
	const { onClick, item, note, modifiers, isPrevOrder = false } = props;

	const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

	const totalPrice = modifiers
		? calculateOrderItemPrice(item, modifiers)
		: item.price;

  const formattedPrice = useMemo(() => {
    if (totalPrice === 0) {
      return "FREE"
    } else if (totalPrice % 1 !== 0) {
      return `$${totalPrice.toFixed((2))}`
    } else {
      return `$${totalPrice}`
    }
	}, [totalPrice])

	return (
		<Button
			px="lg"
			fullWidth
			radius="0"
			h="fit-content"
			variant="transparent"
			color="darkslategray"
			justify="space-between"
			disabled={!item.is_in_stock}
			size={isMobile ? "sm" : "lg"}
			rightSection={<Text fw={700}>{formattedPrice}</Text>}
			onClick={onClick}
		>
			<Stack gap="0" w="100%" align="flex-start" py="xs">
				<Text fw={700}>{item.label}</Text>
				{!isPrevOrder && <Text>{item.description}</Text>}

				{modifiers && modifiers.length > 0 && (
					<ScrollArea h="20px" w="100%">
						<Text size="xs" ta="left">
							{modifiers.map((ingredient) => ingredient.label).join(", ")}
						</Text>
					</ScrollArea>
				)}

				{note && (
					<Text size="xs" fs="italic">
						Note: {note}
					</Text>
				)}
			</Stack>
		</Button>
	);
}

export default MenuItemButton;
