import { Button, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface StyledButtonProps {
  label: string;
  image?: string;
  onClick: () => void;
  textAlign?: CanvasTextAlign;
  isDisabled?: boolean;
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
    isDisabled,
  } = props;

  const isMobile = useMediaQuery(`(max-width: ${em(815)})`);

  return (
    <Button
      px="lg"
      radius={radius}
      variant={variant}
      color="darkslategray"
      size={isMobile ? "md" : "lg"}
      disabled={isDisabled}
      justify={textAlign}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

export default StyledButton;
