import { ActionIcon, Flex } from "@mantine/core";

import type { PropsWithChildren } from "react";
import CoffeeIcon from "../../icons/CoffeeIcon";

function Nav(props: PropsWithChildren) {
  return (
    <Flex gap={4} pos="fixed" justify="space-between">
      <Flex>
        <ActionIcon component="a" aria-label="Home" href="/portal">
          <CoffeeIcon />
        </ActionIcon>
        <ActionIcon component="a" aria-label="Menu" href="/portal/menu">
          <CoffeeIcon />
        </ActionIcon>
        <ActionIcon component="a" aria-label="Orders" href="/portal/orders">
          <CoffeeIcon />
        </ActionIcon>
      </Flex>
      {props.children}
    </Flex>
  );
}

export default Nav;
