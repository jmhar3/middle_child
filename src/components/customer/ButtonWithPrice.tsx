import { Button, em, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface ButtonWithPriceProps {
	onClick: () => void;
	label: string;
	price: number;
	variant?: "filled" | "outline";
	isDisabled?: boolean;
	isLoading?: boolean;
}

function ButtonWithPrice(props: ButtonWithPriceProps) {
	const {
		onClick,
		label,
		price,
		variant = "filled",
		isDisabled,
		isLoading,
	} = props;

	const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

	return (
		<Button
			fullWidth
			variant={variant}
			disabled={isDisabled}
			color="darkslategray"
			justify="space-between"
			size={isMobile ? "md" : "xl"}
			bg={variant === "outline" ? "white" : undefined}
			rightSection={<Text fw={700}>${price.toFixed(2)}</Text>}
			loading={isLoading}
			onClick={onClick}
		>
			{label}
		</Button>
	);
}

export default ButtonWithPrice;
