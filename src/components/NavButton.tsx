import { Button, em } from "@mantine/core";

import CoffeeIcon from "../icons/CoffeeIcon";

import { useMediaQuery } from "@mantine/hooks";

function NavButton() {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <Button
      href="/"
      pos="fixed"
      component="a"
      variant="light"
      w="fit-content"
      color="powderblue"
      bd="powderblue 1px solid"
      leftSection={<CoffeeIcon />}
      px={isMobile ? "sm" : "lg"}
      size={isMobile ? "sm" : "xl"}
      top={isMobile ? "20px" : "11px"}
      left={isMobile ? "20px" : "15px"}
    >
      Menu
    </Button>
  );
}

export default NavButton;
