import { Button, em } from "@mantine/core";

import CoffeeIcon from "../icons/CoffeeIcon";

import { useMediaQuery } from "@mantine/hooks";

function NavButton() {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <Button
      px="lg"
      href="/"
      top="11px"
      left="15px"
      pos="fixed"
      color="red.9"
      component="a"
      variant="light"
      w="fit-content"
      leftSection={<CoffeeIcon />}
      size={isMobile ? "lg" : "xl"}
    >
      Menu
    </Button>
  );
}

export default NavButton;
