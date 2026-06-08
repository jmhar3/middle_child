import { Button, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { ReactElement } from "react";

interface StyledButtonProps {
	label: string;
	image?: string;
	onClick: () => void;
	textAlign?: CanvasTextAlign;
	rightSection?: ReactElement;
	leftSection?: ReactElement;
	isDisabled?: boolean;
	isLoading?: boolean;
	variant?: string;
	radius?: string;
}

function StyledButton(props: StyledButtonProps) {
	const {
		label,
		onClick,
		textAlign,
		variant = "filled",
		radius,
		isLoading,
		isDisabled,
		rightSection,
		leftSection,
	} = props;

	const isMobile = useMediaQuery(`(max-width: ${em(815)})`);

	return (
		<Button
			px="lg"
			radius={radius}
			variant={variant}
			color="darkslategray"
			leftSection={leftSection}
			rightSection={rightSection}
			size={isMobile ? "md" : "lg"}
			loaderProps={{ type: "dots" }}
			disabled={isDisabled}
			loading={isLoading}
			justify={textAlign}
			onClick={onClick}
		>
			{label}
		</Button>
	);
}

export default StyledButton;
