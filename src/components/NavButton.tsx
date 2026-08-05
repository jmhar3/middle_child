import { Button, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface NavButtonProps {
	label: string;
	path: string;
	image?: string;
	isExternal?: boolean;
	textAlign?: CanvasTextAlign;
	isDisabled?: boolean;
	variant?: string;
	width?: string;
}

function NavButton(props: NavButtonProps) {
	const {
		label,
		path,
		textAlign,
		isExternal,
		isDisabled,
		width = "100%",
		variant = "filled",
	} = props;

	const isMobile = useMediaQuery(`(max-width: ${em(815)})`);

	return (
		<Button
			px="lg"
			w={width}
			component="a"
			variant={variant}
			justify={textAlign}
			color="darkslategray"
			disabled={isDisabled}
			style={{ zIndex: 0 }}
			size={isMobile ? "md" : "lg"}
			href={isDisabled ? undefined : path}
			target={isExternal ? "_blank" : undefined}
		>
			{label}
		</Button>
	);
}

export default NavButton;
