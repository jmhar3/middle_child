import { Flex, Stack, Text } from "@mantine/core";

import PageLayout from "./PageLayout";
import Link from "../../components/Link";
import MenuButton from "../../components/MenuButton";

import MapPinIcon from "../../icons/MapPinIcon";
import InstagramIcon from "../../icons/InstagramIcon";

function Menu() {
  return (
    <PageLayout>
      <Stack w="100%" gap="3" p="3">
        <MenuButton
          label="Order Here for Pick Up"
          path="https://heyyou.com.au/restaurant/8394/middle-child"
          isExternal
        />

        <MenuButton label="About Us" path="/about-us" />
        <MenuButton label="Also About Us (AI)" path="/about-us/ai" />

        <MenuButton label="Our Partners" path="/partners" />

        <Flex w="100%" gap="3">
          <MenuButton
            label="Reviews"
            textAlign="right"
            path="https://www.google.com/search?sca_esv=0bd1decbe45b1982&rlz=1C5CHFA_enAU1141AU1151&sxsrf=ANbL-n6dgHEvof21myM1xLGLOgYttYSScg:1769577318013&q=middle+child+cafe&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOcsicezydKAKzR4xDjMImAz9FkPYs9pyJVhJLn6zcmohaCYcQtNfHZOq8KOmUC-aefJZkJCQvgvrLoZcUfgGNiC4tf0G&sa=X&ved=2ahUKEwjbjsWbva2SAxV3TmwGHSxWMFUQrrQLegQIGxAA&biw=1512&bih=823&dpr=2&aic=0"
            isExternal
          />
          <MenuButton
            label="Instagram"
            path="https://www.instagram.com/middlechild_cafe/"
            textAlign="left"
            isExternal
          />
        </Flex>

        <MenuButton label="Nudes" path="" />

        <Stack align="center" py="md" gap="sm">
          <Stack align="center" gap="0">
            <Text>BREWING HOURS</Text>
            <Flex gap="md">
              <Stack align="flex-end" gap="0">
                <Text>Mon - Fri</Text>
                <Text>Sat - Sun</Text>
              </Stack>
              <Stack align="flex-start" gap="0">
                <Text>7:30am - 1pm</Text>
                <Text>7:30am - 2pm</Text>
              </Stack>
            </Flex>
          </Stack>

          <Stack align="center" gap="0">
            <Text>HOLIDAY HOURS</Text>
            <Flex gap="md">
              <Stack align="flex-end" gap="0">
                <Text>Christmas Day</Text>
                <Text>Jan 26 - Jan 31st</Text>
              </Stack>
              <Stack align="flex-start" gap="0">
                <Text>8am - Midday</Text>
                <Text>8am - 2pm</Text>
              </Stack>
            </Flex>
          </Stack>

          <Stack gap="sm" px="sm">
            <Link
              icon={<MapPinIcon />}
              link="https://www.google.com/maps/place/Middle+Child/data=!4m2!3m1!1s0x0:0x254649be2689f48e?sa=X&ved=1t:2428&ictx=111"
              label="327 Maribyrnong Rd, Ascot Vale VIC 3032"
            />

            <Link
              icon={<InstagramIcon />}
              link="https://ig.me/m/middlechild_cafe"
              label="GOT ANY QUESTIONS? GET IN TOUCH"
            />
          </Stack>
        </Stack>
      </Stack>
    </PageLayout>
  );
}

export default Menu;
