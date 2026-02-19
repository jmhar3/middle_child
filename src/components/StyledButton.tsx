import { Button, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface StyledButtonProps {
  label: string;
  image?: string;
  onClick: () => void;
  textAlign?: CanvasTextAlign;
  variant?: string;
  radius?: string;
}

function StyledButton(props: StyledButtonProps) {
  const { label, onClick, textAlign, variant = "filled", radius } = props;

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <Button
      px="lg"
      radius={radius}
      variant={variant}
      color="darkslategray"
      size={isMobile ? "lg" : "xl"}
      justify={textAlign}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

export default StyledButton;
