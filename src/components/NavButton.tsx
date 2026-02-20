import { Button } from "@mantine/core";

import CoffeeIcon from "../icons/CoffeeIcon";

function NavButton() {
  return (
    <Button
      href="/"
      component="a"
      variant="filled"
      w="fit-content"
      color="darkslategray"
      leftSection={<CoffeeIcon />}
      px="md"
      size="sm"
    >
      Menu
    </Button>
  );
}

export default NavButton;
