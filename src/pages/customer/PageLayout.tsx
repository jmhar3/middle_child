import { Box, Button, em, Image, Stack, Title } from "@mantine/core";
import { useLocation } from "react-router-dom";

import type { PropsWithChildren } from "react";

import banner from "/assets/cafe-view.jpeg";
import { useMediaQuery } from "@mantine/hooks";
import CoffeeIcon from "../../icons/CoffeeIcon";

interface PageLayoutProps extends PropsWithChildren {
  hideImage?: boolean;
  image?: string;
  title?: string;
}

function PageLayout({ children, image, title, hideImage }: PageLayoutProps) {
  const { pathname } = useLocation();

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const isMenu = pathname === "/";

  return (
    <Stack align="center" pb="lg" gap="0">
      {!isMenu && (
        <Button
          href="/"
          pos="fixed"
          component="a"
          w="fit-content"
          variant="filled"
          color="darkslategray"
          leftSection={<CoffeeIcon />}
          px={isMobile ? "sm" : "lg"}
          size={isMobile ? "sm" : "xl"}
          top={isMobile ? "20px" : "11px"}
          left={isMobile ? "20px" : "15px"}
        >
          Menu
        </Button>
      )}

      <Box
        w="100%"
        pt={isMobile ? "md" : "lg"}
        pb={isMobile ? "xs" : "md"}
        pr={isMobile && !isMenu ? "lg" : undefined}
      >
        <Title
          lts="1.6px"
          ff="Bangers"
          c="#3f5561"
          ta={isMobile && !isMenu ? "right" : "center"}
        >
          {title || "Middle Child"}
        </Title>
      </Box>

      {!hideImage && (
        <Image
          fit="cover"
          h={isMobile ? "190px" : "300px"}
          src={image || banner}
        />
      )}

      {children}
    </Stack>
  );
}

export default PageLayout;
