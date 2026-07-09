import { Box, Button, Divider, Flex, Stack, Text } from "@mantine/core";

import { formatPrice } from "../../helpers";

interface SizeSelectProps {
	largePrice: number;
	isErroneous?: boolean;
	sizeSelection?: "small" | "large";
	onSizeSelect: (isLarge: boolean) => void;
}

function SizeSelect(props: SizeSelectProps) {
	const { largePrice, isErroneous, sizeSelection, onSizeSelect } = props;

	const formattedPrice = formatPrice(largePrice);

	return (
		<Stack w="100%" gap="6">
			<Stack>
				<Flex>
					<Text pl="3">Size</Text>
					<Text c="crimson" pl="3">
						*
					</Text>
					{isErroneous && (
						<Text c="crimson" pl="3">
							Must select a size
						</Text>
					)}
				</Flex>
			</Stack>

			<Box
				w="100%"
				bg="white"
				bd={`${isErroneous ? "crimson" : "darkslategray"} solid 1px`}
				bdrs="sm"
			>
				<Button.Group w="100%" orientation="vertical">
					<Button
						fullWidth
						radius="0"
						color="darkslategray"
						justify="space-between"
						onClick={() => onSizeSelect(false)}
						variant={sizeSelection === "small" ? "filled" : "transparent"}
					>
						Small
					</Button>

					<Divider />

					<Button
						fullWidth
						radius="0"
						color="darkslategray"
						justify="space-between"
						onClick={() => onSizeSelect(true)}
						rightSection={formattedPrice && `+ ${formattedPrice}`}
						variant={sizeSelection === "large" ? "filled" : "transparent"}
					>
						Large
					</Button>
				</Button.Group>
			</Box>
		</Stack>
	);
}

export default SizeSelect;
