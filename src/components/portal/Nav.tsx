import { Flex, Group } from "@mantine/core";
import { useLocation } from "react-router-dom";

import NavButton from "../NavButton";

import type { PropsWithChildren } from "react";

function Nav(props: PropsWithChildren) {
  const { pathname } = useLocation();

  return (
    <Flex
      p="sm"
      gap="sm"
      w="100vw"
      top="0px"
      pos="fixed"
      justify="space-between"
    >
      <Group gap="sm">
        <NavButton
          width="fit-content"
          label="Take Orders"
          path="/portal/orders"
          isDisabled={pathname.includes("orders")}
        />
        <NavButton
          width="fit-content"
          label="Edit Menu"
          path="/portal/menu"
          isDisabled={pathname.includes("menu")}
        />
        <NavButton
          width="fit-content"
          label="View Stats"
          path="/portal/stats"
          isDisabled={pathname.includes("stats")}
        />
      </Group>

      <Group gap="sm" w="fit-content">
        {props.children}
      </Group>
    </Flex>
  );
}

export default Nav;
