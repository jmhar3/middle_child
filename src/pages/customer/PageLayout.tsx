import { Burger, Flex, Image, Stack, Title } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";

import Weather from "../../components/Weather";

import banner from "/assets/cafe-view.jpeg";

import type { PropsWithChildren } from "react";

interface PageLayoutProps extends PropsWithChildren {
	hideImage?: boolean;
	image?: string;
	title?: string;
}

function PageLayout({ children, image, title, hideImage }: PageLayoutProps) {
	const { pathname } = useLocation();
	const navigate = useNavigate();

	const isMobile = useMediaQuery(`(max-width: 750px)`);

	const isMenu = pathname === "/";

	return (
		<Stack align="center" gap="0" pt="4em" w="100vw">
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
				{!isMenu && (
					<Burger
						opened={false}
						color="darkslategray"
						lineSize={isMobile ? 3 : 4}
						size={isMobile ? "md" : "lg"}
						onClick={() => navigate("/")}
						aria-label="Open Navigation Menu"
						style={{ zIndex: 999 }}
					/>
				)}

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
					w="100%"
					fit="cover"
					h={isMobile ? "190px" : "390px"}
					src={image || banner}
				/>
			)}

			{children}
		</Stack>
	);
}

export default PageLayout;
