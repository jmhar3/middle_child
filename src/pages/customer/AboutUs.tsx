import { Text, Box } from "@mantine/core";
import { useLocation } from "react-router-dom";

import PageLayout from "./PageLayout";

import banner from "/assets/middle-child-banner.webp";

function AboutUs() {
  const aboutUs =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum molestie molestie nisi non mattis. Praesent dapibus nunc vitae justo maximus, id elementum enim accumsan. Quisque tempus viverra metus eu bibendum. Morbi venenatis semper convallis. Praesent placerat convallis aliquet. Vivamus faucibus id orci non fringilla. Maecenas maximus erat vitae eros dapibus dignissim. Aliquam blandit odio nunc, et dapibus urna rutrum et. Ut ac erat nulla.";
  const aboutUsAi =
    "AI-powered Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum molestie molestie nisi non mattis. Praesent dapibus nunc vitae justo maximus, id elementum enim accumsan. Quisque tempus viverra metus eu bibendum. Morbi venenatis semper convallis. Praesent placerat convallis aliquet. Vivamus faucibus id orci non fringilla. Maecenas maximus erat vitae eros dapibus dignissim. Aliquam blandit odio nunc, et dapibus urna rutrum et. Ut ac erat nulla.";

  const { pathname } = useLocation();
  const isAi = pathname.includes("ai");

  return (
    <PageLayout image={banner} title={isAi ? "AI About Us" : "About Us"}>
      <Box p="lg" maw="1440px">
        <Text>{isAi ? aboutUsAi : aboutUs}</Text>
      </Box>
    </PageLayout>
  );
}

export default AboutUs;
