import { Button } from "@mantine/core";

import CoffeeIcon from "../icons/CoffeeIcon";

function NavButton() {
  return (
    <Button
      px="md"
      size="sm"
      href="/"
      component="a"
      variant="filled"
      w="fit-content"
      color="darkslategray"
      leftSection={<CoffeeIcon />}
      style={{ zIndex: 999 }}
    >
      Menu
    </Button>
  );
}

export default NavButton;
