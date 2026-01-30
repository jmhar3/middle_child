import { Button, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface MenuButtonProps {
  label: string;
  path: string;
  image?: string;
  isExternal?: boolean;
  textAlign?: CanvasTextAlign;
}

function MenuButton(props: MenuButtonProps) {
  const { label, path, isExternal, textAlign } = props;

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <Button
      px="lg"
      w="100%"
      component="a"
      variant="light"
      color="darkslategray"
      justify={textAlign}
      bd="darkslategray 1px solid"
      size={isMobile ? "lg" : "xl"}
      target={isExternal ? "_blank" : undefined}
      href={path}
    >
      {label}
    </Button>
  );
}

export default MenuButton;
