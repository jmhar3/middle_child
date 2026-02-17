import { Text, Box, Stack } from "@mantine/core";
import { useLocation } from "react-router-dom";

import PageLayout from "./PageLayout";

import banner from "/assets/cafe-plants.jpg";

function AboutUs() {
  const { pathname } = useLocation();
  const isAi = pathname.includes("ai");

  return (
    <PageLayout image={banner} title={isAi ? "AI About Us" : "About Us"}>
      <Box p="lg" maw="1440px">
        {isAi ? (
          <Stack>
            <Text>
              A beloved local "hole-in-the-wall" style coffee shop situated near
              the river.
            </Text>
            <Text>
              <Text fw={700}>Focus:</Text> Known for exceptional specialty
              coffee (Rumble Coffee beans), fresh pastries, and its
              community-focused, dog-friendly atmosphere.
            </Text>
            <Text>
              <Text fw={700}>Notable Features:</Text> Offers popular
              "puppacinos" with lactose-free milk and ground dog treats for
              visiting pets.
            </Text>
          </Stack>
        ) : (
          <Stack>
            <Text>
              Ok here we go,
              <br />
              It's always been about the coffee. Well at least it has been once
              I figured out how to make one. We opened back in 2016 with a real
              intent to do things differently. Hang on a sec,
            </Text>
            <Text>
              What ya after buddy?
              <br />
              Big or small?
              <br />
              Too easy.
            </Text>
            <Text>
              Yeah, every coffee shop does the same sh*t so I figured let's just
              not charge surcharges ever and not charge for the milks. It's
              worked. You guys seem to really appreciate it. Also learnt pretty
              quick that people want coffee every day of the week. So here we
              are.
              <br />
              Everyday.
              <br />
              Maybe not the best time to do this,
            </Text>
            <Text>
              Hey man, shorty and a roll?
              <br />
              Spicy or regular?
              <br />
              ‘SPICY BACON AND EGG!’
            </Text>
            <Text>
              The food we do is simple and made fresh. The rule is that you can
              walk around the river with your food in one hand and a coffee in
              the other. If you need cutlery we don't make it. But if you want
              to sit in and eat a chicken toastie with a knife and fork go nuts.
              Be that guy.
            </Text>
            <Text>
              From one coffee and no real clue to 5 different coffees (3
              rotating black options) from what we genuinely believe are the
              best roasters in Melbourne. We take making your coffee seriously
              but try to do it all without pretentiousness (did I spell that
              properly?). I think we pull it off but I'm maybe not the right
              person to ask. Hang on,
            </Text>
            <Text>
              Morning buddy,
              <br />
              Yeah,
              <br />
              Sweet as,
              <br />
              Sugar?
              <br />
              No syrups sorry,
              <br />
              Honey yeah
              <br />
              On the way.
            </Text>
            <Text>
              Oh and we have smoothies that are all frozen fresh fruit so they
              are super cold and we name them after the dogs that visit us
              everyday. When I was talking about the coffee before did I mention
              that we sell beans? We sell beans. Heaps. For whatever way you
              drink your coffee.
            </Text>
            <Text>
              What else? We sell bread and listen to 90's music every Friday.
            </Text>
            <Text>
              Lily is that everything? I think I covered most stuff.
              <br />
              I'm not talking about the bathroom. I think they figure we have a
              bathroom.
            </Text>
          </Stack>
        )}
      </Box>
    </PageLayout>
  );
}

export default AboutUs;
