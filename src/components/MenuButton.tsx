import { Button } from "@mantine/core";

interface MenuButtonProps {
  label: string;
  path: string;
  image?: string;
  isExternal?: boolean;
  textAlign?: CanvasTextAlign;
}

function MenuButton(props: MenuButtonProps) {
  const { label, path, isExternal, textAlign } = props;

  return (
    <Button
      px="lg"
      w="100%"
      size="xl"
      color="red"
      component="a"
      variant="light"
      justify={textAlign}
      target={isExternal ? "_blank" : undefined}
      href={path}
    >
      {label}
    </Button>
  );
}

export default MenuButton;
