import { Button } from "@mantine/core";
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

  const isMobile = useMediaQuery(`(max-width: 750px)`);

  return (
    <Button
      px="lg"
      w="100%"
      component="a"
      variant="filled"
      color="darkslategray"
      justify={textAlign}
      size={isMobile ? "lg" : "xl"}
      target={isExternal ? "_blank" : undefined}
      href={path}
    >
      {label}
    </Button>
  );
}

export default MenuButton;
