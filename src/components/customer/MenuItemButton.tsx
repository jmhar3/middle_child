import { Button, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { PropsWithChildren } from "react";

interface MenuItemButtonProps extends PropsWithChildren {
  onClick: () => void;
}

function MenuItemButton(props: MenuItemButtonProps) {
  const { children, onClick } = props;

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <Button
      px="lg"
      w="100%"
      color="red"
      variant="light"
      size={isMobile ? "md" : "lg"}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export default MenuItemButton;
