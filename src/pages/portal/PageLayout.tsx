import { Box, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import Nav from "../../components/portal/Nav";

import type { PropsWithChildren, ReactNode } from "react";

interface PageLayoutProps extends PropsWithChildren {
  navComponents: ReactNode;
}

function PageLayout({ children, navComponents }: PageLayoutProps) {
  const isMobile = useMediaQuery(`(max-width: 750px)`);

  return (
    <Box mih="100vh">
      <Nav>{navComponents}</Nav>

      <Stack pt={isMobile ? "4em" : "5.2em"} pb="lg" w="100vw">
        {children}
      </Stack>
    </Box>
  );
}

export default PageLayout;
