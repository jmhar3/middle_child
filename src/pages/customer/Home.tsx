import { useEffect } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { Divider, em, Flex, Stack, Text } from "@mantine/core";

import PageLayout from "./PageLayout";
import NavButton from "../../components/NavButton";
import Link from "../../components/Link";

import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { selectUser, selectUserStatus } from "../../state/user/userSlice";
import { fetchUser } from "../../state/user/userThunks";

import MapPinIcon from "../../icons/MapPinIcon";
import InstagramIcon from "../../icons/InstagramIcon";
import EmailIcon from "../../icons/EmailIcon";

function Home() {
  const isMobile = useMediaQuery(`(max-width: ${em(900)})`);

  const dispatch = useAppDispatch();
  const userStatus = useAppSelector(selectUserStatus);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(fetchUser());
    }
  }, [dispatch, userStatus]);

  return (
    <PageLayout>
      <Stack w="100%" gap="3" p="3">
        <NavButton label="Order Here for Pick Up" path="/menu" />

        <NavButton
          label={user ? "Manage Account" : "Login / Sign Up"}
          path="/account"
        />

        <NavButton label="About Us" path="/about-us" />
        <NavButton label="Also About Us (AI)" path="/about-us/ai" />

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

        <NavButton label="Nudes" path="" />

        <Stack align="center" py="md" gap="xs">
          <Stack align="center" gap="sm" pb={isMobile ? undefined : "lg"}>
            <Flex
              py="md"
              align="center"
              gap={isMobile ? "sm" : "xl"}
              dir={isMobile ? "column" : "row"}
            >
              <Stack align="center" gap="0">
                <Text>BREWING HOURS</Text>
                <Flex gap="md">
                  <Stack align={isMobile ? "flex-end" : "flex-start"} gap="0">
                    <Text>Mon - Fri</Text>
                    <Text>Sat - Sun</Text>
                  </Stack>
                  <Stack align={isMobile ? "flex-start" : "flex-end"} gap="0">
                    <Text>7:30am - 1pm</Text>
                    <Text>7:30am - 2pm</Text>
                  </Stack>
                </Flex>
              </Stack>

              {!isMobile && <Divider orientation="vertical" />}

              <Stack align="center" gap="0">
                <Text>HOLIDAY HOURS</Text>
                <Flex gap="md">
                  <Stack align={isMobile ? "flex-end" : "flex-start"} gap="0">
                    <Text>Christmas Day</Text>
                    <Text>Jan 26 - Jan 31st</Text>
                  </Stack>
                  <Stack align={isMobile ? "flex-start" : "flex-end"} gap="0">
                    <Text>8am - Midday</Text>
                    <Text>8am - 2pm</Text>
                  </Stack>
                </Flex>
              </Stack>
            </Flex>

            <Flex
              direction={isMobile ? "column" : "row"}
              gap={isMobile ? "sm" : "md"}
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
                label="GOT ANY QUESTIONS? GET IN TOUCH"
              />
            </Flex>
          </Stack>
        </Stack>
      </Stack>
    </PageLayout>
  );
}

export default Home;
