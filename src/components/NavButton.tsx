import { Button } from "@mantine/core";

import CoffeeIcon from "../icons/CoffeeIcon";

function NavButton() {
  return (
    <Button
      px="lg"
      href="/"
      size="xl"
      top="11px"
      right="15px"
      pos="fixed"
      color="red.9"
      component="a"
      variant="light"
      w="fit-content"
      leftSection={<CoffeeIcon />}
    >
      Menu
    </Button>
  );
}

export default NavButton;
