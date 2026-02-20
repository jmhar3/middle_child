import { Image, Stack, Title } from "@mantine/core";
import { useLocation } from "react-router-dom";

import type { PropsWithChildren } from "react";

import NavButton from "../../components/NavButton";

import banner from "/assets/cafe-view.jpeg";
import { useMediaQuery } from "@mantine/hooks";

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
