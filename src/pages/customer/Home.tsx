import { useEffect } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { Divider, Flex, Stack, Text } from "@mantine/core";

import PageLayout from "./PageLayout";
import NavButton from "../../components/NavButton";
import Link from "../../components/Link";

import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { selectUser, selectUserStatus } from "../../state/user/userSlice";
import { fetchUser } from "../../state/user/userThunks";

import MapPinIcon from "../../icons/MapPinIcon";
import InstagramIcon from "../../icons/InstagramIcon";
import EmailIcon from "../../icons/EmailIcon";
import {
	selectStoreInfo,
	selectStoreInfoStatus,
	selectStoreIsOpen,
} from "../../state/storeInfo/storeInfoSlice";
import { fetchStoreInfo } from "../../state/storeInfo/storeInfoThunks";

function Home() {
	const isMobile = useMediaQuery("(max-width: 960px)");

	const dispatch = useAppDispatch();
	const userStatus = useAppSelector(selectUserStatus);
	const user = useAppSelector(selectUser);
	const storeInfoStatus = useAppSelector(selectStoreInfoStatus);
	const storeInfo = useAppSelector(selectStoreInfo);
	// const storeIsOpen = useAppSelector(selectStoreIsOpen);

	useEffect(() => {
		if (userStatus === "idle") {
			dispatch(fetchUser());
		}
		if (storeInfoStatus === "idle") {
			dispatch(fetchStoreInfo());
		}
	}, [dispatch, userStatus, storeInfoStatus]);

	return (
		<PageLayout>
			<Stack w="100%" gap="3" p="3">
				{/*<NavButton
					path="/menu"
					isDisabled={
						storeInfoStatus !== "idle" &&
						storeInfoStatus !== "pending" &&
						!storeIsOpen
					}
					label="Order Here for Pick Up"
				/>*/}

				<NavButton
          path="https://heyyou.com.au/restaurant/8394/middle-child"
					label="Order Here for Pick Up"
					isExternal
				/>

				<Flex w="100%" gap="3">
					<NavButton label="About Us" path="/about-us" />
					<NavButton label="Also About Us (AI)" path="/about-us/ai" />
				</Flex>

				<NavButton label="Look Here & Don't Pick Up" path="/view-menu" />

				<NavButton label="Our Partners" path="/partners" />

				<Flex w="100%" gap="3">
					<NavButton
						label="Reviews"
						textAlign="right"
						path="https://www.google.com/search?sca_esv=0bd1decbe45b1982&rlz=1C5CHFA_enAU1141AU1151&sxsrf=ANbL-n6dgHEvof21myM1xLGLOgYttYSScg:1769577318013&q=middle+child+cafe&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOcsicezydKAKzR4xDjMImAz9FkPYs9pyJVhJLn6zcmohaCYcQtNfHZOq8KOmUC-aefJZkJCQvgvrLoZcUfgGNiC4tf0G&sa=X&ved=2ahUKEwjbjsWbva2SAxV3TmwGHSxWMFUQrrQLegQIGxAA&biw=1512&bih=823&dpr=2&aic=0"
						isExternal
					/>
					<NavButton
						label="Instagram"
						path="https://www.instagram.com/middlechild_cafe/"
						textAlign="left"
						isExternal
					/>
				</Flex>

				<NavButton
					label={user ? "Manage Account" : "Login / Sign Up"}
					path="/account"
				/>

				<NavButton label="Nudes" path="" />

				<Stack gap="sm" align="center" pb={isMobile ? undefined : "lg"}>
					<Flex
						py="md"
						align="center"
						gap={isMobile ? "sm" : "xl"}
						direction={isMobile ? "column" : "row"}
					>
						<Stack align="center" gap="0">
							<Text>BREWING HOURS</Text>

							<Flex gap="md">
								<Stack align={isMobile ? "flex-end" : "flex-start"} gap="0">
									{storeInfo.opening_hours.map(({ label }) => (
										<Text key={label}>{label}</Text>
									))}
								</Stack>

								<Stack align={isMobile ? "flex-start" : "flex-end"} gap="0">
									{storeInfo.opening_hours.map(({ label, hours }) => (
										<Text key={label}>
											{hours.from} - {hours.to}
										</Text>
									))}
								</Stack>
							</Flex>
						</Stack>

						{!isMobile && <Divider orientation="vertical" />}

						{storeInfo.holiday_opening_hours && (
							<Stack align="center" gap="0">
								<Text>HOLIDAY HOURS</Text>

								<Flex gap="md">
									<Stack align={isMobile ? "flex-end" : "flex-start"} gap="0">
										{storeInfo.holiday_opening_hours.map(({ label }) => (
											<Text key={label}>{label}</Text>
										))}
									</Stack>

									<Stack align={isMobile ? "flex-start" : "flex-end"} gap="0">
										{storeInfo.holiday_opening_hours.map(({ label, hours }) => (
											<Text key={label}>
												{hours.from} - {hours.to}
											</Text>
										))}
									</Stack>
								</Flex>
							</Stack>
						)}
					</Flex>

					<Flex
						w="100%"
						justify="center"
						pb={isMobile ? "3px" : "sm"}
						gap={isMobile ? "3px" : "sm"}
						direction={isMobile ? "column" : "row"}
					>
						<Link
							icon={<MapPinIcon />}
							link="https://www.google.com/maps/place/Middle+Child/data=!4m2!3m1!1s0x0:0x254649be2689f48e?sa=X&ved=1t:2428&ictx=111"
							label="327 Maribyrnong Rd, Ascot Vale VIC 3032"
						/>

						<Link
							icon={<EmailIcon />}
							link="mailto:middlechildcafe@gmail.com"
							label="GOT ANY QUESTIONS? EMAIL US"
						/>

						<Link
							icon={<InstagramIcon />}
							link="https://ig.me/m/middlechild_cafe"
							label="MESSAGE US ON INSTAGRAM"
						/>
					</Flex>
				</Stack>
			</Stack>
		</PageLayout>
	);
}

export default Home;
