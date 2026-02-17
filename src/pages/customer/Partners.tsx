import { Button, Group, em, Image } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import PageLayout from "./PageLayout";

import backhausLogo from "/assets/backhaus-bakery-logo.webp";
import criteriaLogo from "/assets/criteria-coffee-logo.png";
import rumbleLogo from "/assets/rumble-coffee-logo.webp";
import drunkenSailorLogo from "/assets/drunken-sailor-canning-co-logo.webp";

import banner from "/assets/partners.jpg";

function Partners() {
  const suppliers = [
    {
      image: rumbleLogo,
      label: "Rumble Coffee Roasters",
      link: "https://www.rumblecoffee.com.au",
    },
    {
      image: criteriaLogo,
      label: "Criteria Coffee",
      link: "https://www.criteriacoffee.com",
    },
    {
      image: backhausLogo,
      label: "Backhaus Bakery",
      link: "https://www.backhaus.com.au",
    },
    {
      image: drunkenSailorLogo,
      label: "Drunken Sailor Canning Co.",
      link: "https://www.drunkensailor.com.au",
    },
  ];

  return (
    <PageLayout image={banner} title="Our Partners">
      <Group p="lg" gap="lg" maw="1440px" align="center" justify="center">
        {suppliers.map((supplier) => (
          <Button
            p="3"
            radius="md"
            component="a"
            variant="light"
            target="_blank"
            w="fit-content"
            h="fit-content"
            color="darkslategray"
            key={supplier.label}
            href={supplier.link}
          >
            <Image h={120} radius="sm" fit="contain" src={supplier.image} />
          </Button>
        ))}
      </Group>
    </PageLayout>
  );
}

export default Partners;
