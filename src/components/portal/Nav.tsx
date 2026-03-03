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
      bg="whitesmoke"
      justify="space-between"
    >
      <Group gap="sm">
        <NavButton
          width="fit-content"
          label="Take Orders"
          path="/portal/orders"
          variant={pathname.includes("orders") ? "outline" : undefined}
        />
        <NavButton
          width="fit-content"
          label="Edit Menu"
          path="/portal/menu"
          variant={pathname.includes("menu") ? "outline" : undefined}
        />
        <NavButton
          width="fit-content"
          label="View Stats"
          path="/portal/stats"
          variant={pathname.includes("stats") ? "outline" : undefined}
        />
      </Group>

      <Group gap="sm" w="fit-content">
        {props.children}
      </Group>
    </Flex>
  );
}

export default Nav;
