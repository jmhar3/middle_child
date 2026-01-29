import { Flex, Stack, Text } from "@mantine/core";

import HomeButton from "../../components/customer/HomeButton";
import Link from "../../components/Link";

import PageLayout from "./PageLayout";

function Home() {
  return (
    <PageLayout>
      <Stack w="100%" gap="3" p="3">
        <HomeButton
          label="Order Here for Pick Up"
          path="https://heyyou.com.au/restaurant/8394/middle-child"
          isExternal
        />

        <HomeButton label="About Us" path="/about-us" />
        <HomeButton label="Also About Us (AI)" path="/about-us/ai" />

        <HomeButton label="Our Partners" path="/partners" />

        <Flex w="100%" gap="3">
          <HomeButton
            label="Reviews"
            textAlign="right"
            path="https://www.google.com/search?sca_esv=0bd1decbe45b1982&rlz=1C5CHFA_enAU1141AU1151&sxsrf=ANbL-n6dgHEvof21myM1xLGLOgYttYSScg:1769577318013&q=middle+child+cafe&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOcsicezydKAKzR4xDjMImAz9FkPYs9pyJVhJLn6zcmohaCYcQtNfHZOq8KOmUC-aefJZkJCQvgvrLoZcUfgGNiC4tf0G&sa=X&ved=2ahUKEwjbjsWbva2SAxV3TmwGHSxWMFUQrrQLegQIGxAA&biw=1512&bih=823&dpr=2&aic=0"
            isExternal
          />
          <HomeButton
            label="Instagram"
            path="https://www.instagram.com/middlechild_cafe/"
            textAlign="left"
            isExternal
          />
        </Flex>

        <HomeButton label="Nudes" path="" />

        <Stack align="center" py="md" gap="xs">
          <Text>Open 8am - 2pm everyday</Text>

          <Link
            link="https://www.google.com/maps/place/Middle+Child/data=!4m2!3m1!1s0x0:0x254649be2689f48e?sa=X&ved=1t:2428&ictx=111"
            label="327 Maribyrnong Rd, Ascot Vale VIC 3032"
          />
        </Stack>
      </Stack>
    </PageLayout>
  );
}

export default Home;
