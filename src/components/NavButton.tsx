import { Button } from "@mantine/core";

import CoffeeIcon from "../icons/CoffeeIcon";

import { useMediaQuery } from "@mantine/hooks";

function NavButton() {
  const isMobile = useMediaQuery(`(max-width: 750px)`);

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
