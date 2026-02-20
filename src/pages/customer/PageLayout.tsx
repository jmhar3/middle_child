import { Box, Image, Stack, Title } from "@mantine/core";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";

import type { PropsWithChildren } from "react";

import NavButton from "../../components/NavButton";
import Weather from "../../components/Weather";

import banner from "/assets/cafe-view.jpeg";

interface PageLayoutProps extends PropsWithChildren {
  hideImage?: boolean;
  image?: string;
  title?: string;
}

function PageLayout({ children, image, title, hideImage }: PageLayoutProps) {
  const { pathname } = useLocation();

  const isMobile = useMediaQuery(`(max-width: 750px)`);

  const isMenu = pathname === "/";

  return (
    <Stack align="center" gap="0">
      {!isMenu && <NavButton />}

      {isMenu && (
        <Box top="0px" right="0px" pos="fixed" w="fit-content">
          <Weather />
        </Box>
      )}

      <Title
        w="100%"
        lts="1.6px"
        ff="Bangers"
        c="darkslategray"
        pt={isMobile ? "md" : "lg"}
        pb={isMobile ? "xs" : "md"}
        pr={isMobile && !isMenu ? "lg" : undefined}
        ta={isMobile && !isMenu ? "right" : "center"}
      >
        {title || "Middle Child"}
      </Title>

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
