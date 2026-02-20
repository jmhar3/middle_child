import { Flex, Image, Stack, Title } from "@mantine/core";
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
    <Stack align="center" gap="0" pt="4em">
      <Flex
        pt="sm"
        pb="xs"
        w="100%"
        top="0"
        left="0"
        pos="fixed"
        align="center"
        bg="whitesmoke"
        justify="space-between"
        pl={isMobile ? "md" : "lg"}
        pr={isMobile ? "md" : "lg"}
      >
        {!isMenu && <NavButton />}

        {isMenu && <Weather />}

        {isMobile ? (
          <Title lts="1.6px" ff="Bangers" c="darkslategray">
            {title || "Middle Child"}
          </Title>
        ) : (
          <Flex style={{ zIndex: 1 }} w="100%" pos="fixed" justify="center">
            <Title
              pr="lg"
              lts="1.6px"
              ff="Bangers"
              c="darkslategray"
              pt={isMobile ? "md" : "lg"}
              pb={isMobile ? "xs" : "md"}
            >
              {title || "Middle Child"}
            </Title>
          </Flex>
        )}
      </Flex>

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
