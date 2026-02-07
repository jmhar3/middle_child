import { ActionIcon, Flex } from "@mantine/core";
import EditNoteIcon from "@mui/icons-material/EditNote";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TableChartIcon from "@mui/icons-material/TableChart";

import type { PropsWithChildren } from "react";

function Nav(props: PropsWithChildren) {
  return (
    <Flex gap={4} pos="fixed" justify="space-between">
      <Flex>
        <ActionIcon component="a" aria-label="Home" href="/portal">
          <StorefrontIcon />
        </ActionIcon>
        <ActionIcon component="a" aria-label="Menu" href="/portal/menu">
          <EditNoteIcon />
        </ActionIcon>
        <ActionIcon component="a" aria-label="Orders" href="/portal/orders">
          <TableChartIcon />
        </ActionIcon>
      </Flex>
      {props.children}
    </Flex>
  );
}

export default Nav;
