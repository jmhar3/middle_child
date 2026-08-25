import { useMemo } from "react";
import { Box, Button, Divider, Flex, Stack, Text } from "@mantine/core";

import { formatPrice } from "../../helpers";

import type { Modifier } from "../../state/types";

interface ModifierRadioProps {
	label?: string;
	isRequired: boolean;
	modifiers: Modifier[];
	isErroneous?: boolean;
	selectedModifiers?: Modifier[];
	onModifierSelect: (selectedModifier: Modifier, isSelected: boolean) => void;
}

function ModifierRadio(props: ModifierRadioProps) {
	const {
		label,
		isRequired,
		modifiers,
		isErroneous,
		onModifierSelect,
		selectedModifiers,
	} = props;

	const sortedModifiers = useMemo(() => {
		return [...modifiers].sort((a, b) => (a.order || 1) - (b.order || 1));
	}, [modifiers]);

	const onSelection = (newSelection: Modifier) => {
		const previousSelection = modifiers.find((modifier) =>
			selectedModifiers?.some(({ id }) => modifier.id === id),
		);
		// unselect old modifier
		if (previousSelection) onModifierSelect(previousSelection, false);
		// select new modifier
		onModifierSelect(newSelection, true);
	};

	return (
		<Stack w="100%" gap="6">
			<Stack>
				{label && (
					<Flex>
						<Text pl="3">{label}</Text>
						{isRequired && (
							<Text c="crimson" pl="3">
								*
							</Text>
						)}
						{isErroneous && (
							<Text c="crimson" pl="3">
								Must select option
							</Text>
						)}
					</Flex>
				)}
			</Stack>

			<Box
				w="100%"
				bg="white"
				bd={`${isErroneous ? "crimson" : "darkslategray"} solid 1px`}
				bdrs="sm"
			>
				<Button.Group w="100%" orientation="vertical">
					{sortedModifiers.map((modifier, index) => {
						const isSelected = selectedModifiers?.some(
							({ id }) => modifier.id === id,
						);
						const formattedPrice =
							modifier.price && formatPrice(modifier.price);

						return (
							<>
								{index !== 0 && <Divider />}

								<Button
									fullWidth
									radius="0"
									key={modifier.id}
									color="darkslategray"
									justify="space-between"
									h={modifier.description && "4.1em"}
									variant={isSelected ? "filled" : "transparent"}
									rightSection={formattedPrice && `+ ${formattedPrice}`}
									disabled={modifier.is_ingredient && !modifier.is_in_stock}
									onClick={() =>
										isSelected
											? onModifierSelect(modifier, false)
											: onSelection(modifier)
									}
								>
									<Stack gap="3" align="flex-start" justify="center">
										{modifier.label}
										{modifier.description && (
											<Text size="sm">{modifier.description}</Text>
										)}
									</Stack>
								</Button>
							</>
						);
					})}
				</Button.Group>
			</Box>
		</Stack>
	);
}

export default ModifierRadio;
