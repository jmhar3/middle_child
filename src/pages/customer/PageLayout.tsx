import { em, Image, Stack, Title } from "@mantine/core";
import { useLocation } from "react-router-dom";

import type { PropsWithChildren } from "react";

import NavButton from "../../components/NavButton";

import banner from "/assets/middle-child-banner.webp";
import { useMediaQuery } from "@mantine/hooks";

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
    <Stack align="center" pb="lg" gap="3">
      {!isMenu && <NavButton />}

      <Title
        pr="lg"
        pt="lg"
        pb="md"
        w="100%"
        lts="1.6px"
        ff="Bangers"
        ta={isMobile && !isMenu ? "right" : "center"}
      >
        {title || "Middle Child"}
      </Title>

      {!hideImage && (
        <Image h={isMobile ? "150px" : "300px"} src={image || banner} />
      )}

      {children}
    </Stack>
  );
}

export default PageLayout;
