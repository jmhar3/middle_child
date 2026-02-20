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
      color="darkslategray"
      size={isMobile ? "md" : "lg"}
      target={isExternal ? "_blank" : undefined}
      disabled={isDisabled}
      justify={textAlign}
      href={path}
    >
      {label}
    </Button>
  );
}

export default NavButton;
