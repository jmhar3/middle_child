import { Flex } from "@mantine/core";

import NavButton from "../NavButton";

import type { PropsWithChildren } from "react";

function Nav(props: PropsWithChildren) {
  return (
    <Flex gap={4} pos="fixed" justify="space-between">
      <Flex>
        <NavButton label="Edit Menu" path="/portal/menu" />
        <NavButton label="Take Orders" path="/portal/orders" />
        <NavButton label="View Stats" path="/portal/stats" />
      </Flex>
      {props.children}
    </Flex>
  );
}

export default Nav;
