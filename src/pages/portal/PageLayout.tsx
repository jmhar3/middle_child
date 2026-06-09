import { useEffect, type PropsWithChildren, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { Box, em, Flex, Stack, Text, Title } from "@mantine/core";

import Nav from "../../components/portal/Nav";
import LoginModal from "../../components/LoginModal";
import StyledButton from "../../components/StyledButton";

import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { selectUser, selectUserStatus } from "../../state/user/userSlice";
import { fetchUser, signOutUser } from "../../state/user/userThunks";

interface PageLayoutProps extends PropsWithChildren {
	navComponents?: ReactNode;
}

function PageLayout({ children, navComponents }: PageLayoutProps) {
	const isMobile = useMediaQuery(`(max-width: ${em(815)})`);
	const navigate = useNavigate();

	const dispatch = useAppDispatch();
	const userStatus = useAppSelector(selectUserStatus);
	const user = useAppSelector(selectUser);

	useEffect(() => {
		if (userStatus === "idle") {
			dispatch(fetchUser());
		}
	}, [dispatch, userStatus]);

	if (!user) return <LoginModal isModalOpen={true} onModalClose={() => {}} />;

	if (user.is_admin)
		return (
			<Box mih="100vh">
				<Nav>{navComponents}</Nav>

				<Stack pt={isMobile ? "4em" : "5.2em"} pb="lg" w="100vw">
					{children}
				</Stack>
			</Box>
		);

	return (
		<Stack align="center" py="9em">
			<Stack gap="xs" align="center">
				<Title size="1.8em">This route requires admin permissions.</Title>
				<Text size="1.2em">
					Try logging in to a different account or return to the menu.
				</Text>
			</Stack>

			<Flex gap="md">
				<StyledButton label="Logout" onClick={() => dispatch(signOutUser())} />
				<StyledButton label="Menu" onClick={() => navigate("/")} />
			</Flex>
		</Stack>
	);
}

export default PageLayout;
