import { Flex, Group } from "@mantine/core";

import NavButton from "../NavButton";

import type { PropsWithChildren } from "react";

function Nav(props: PropsWithChildren) {
  return (
    <Flex
      p="sm"
      gap="sm"
      w="100vw"
      top="0px"
      pos="fixed"
      bg="white"
      justify="space-between"
    >
      <Group gap="sm">
        <NavButton
          width="fit-content"
          label="Take Orders"
          path="/portal/orders"
        />
        <NavButton width="fit-content" label="Edit Menu" path="/portal/menu" />
      </Group>

      <Group gap="sm" w="fit-content">
        {props.children}
      </Group>
    </Flex>
  );
}

export default Nav;
