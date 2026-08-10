import { useMemo } from "react";
import { Box, Button, Divider, Flex, Stack, Text } from "@mantine/core";

import CheckIcon from "../../icons/CheckIcon";

import { formatPrice } from "../../helpers";

import type { Modifier } from "../../state/types";

interface ModifierCheckboxProps {
	label?: string;
	isRequired: boolean;
	modifiers: Modifier[];
	isErroneous?: boolean;
	selectedModifiers?: Modifier[];
	onModifierSelect: (selectedModifier: Modifier, isSelected: boolean) => void;
}

function ModifierCheckbox(props: ModifierCheckboxProps) {
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

	return (
		<Stack w="100%" gap="6">
			<Stack>
				{label && (
					<Flex>
						<Text pl="3">{label}</Text>
						{isRequired && (
							<Text c="red" pl="3">
								*
							</Text>
						)}
						{isErroneous && (
							<Text c="red" pl="3">
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
									variant={isSelected ? "filled" : "transparent"}
									rightSection={formattedPrice && `+ ${formattedPrice}`}
									onClick={() => onModifierSelect(modifier, !isSelected)}
									disabled={modifier.is_ingredient && !modifier.is_in_stock}
								>
									{modifier.label}{" "}
									{isSelected && (
										<Box pl="3">
											<CheckIcon />
										</Box>
									)}
								</Button>
							</>
						);
					})}
				</Button.Group>
			</Box>
		</Stack>
	);
}

export default ModifierCheckbox;
