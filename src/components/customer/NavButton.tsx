import { Box, Button, em } from "@mantine/core";

import CoffeeIcon from "../../icons/CoffeeIcon";

import { useMediaQuery } from "@mantine/hooks";

function NavButton() {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <Box
      bdrs="sm"
      pos="fixed"
      bg="darkslategray"
      w="fit-content"
      top={isMobile ? "20px" : "11px"}
      left={isMobile ? "20px" : "15px"}
    >
      <Button
        href="/"
        fullWidth
        component="a"
        w="fit-content"
        variant="light"
        color="powderblue"
        bd="powderblue 1px solid"
        leftSection={<CoffeeIcon />}
        px={isMobile ? "sm" : "lg"}
        size={isMobile ? "sm" : "xl"}
      >
        Menu
      </Button>
    </Box>
  );
}

export default NavButton;
