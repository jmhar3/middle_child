import { Button, Group, em, Image } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import backhausLogo from "/assets/backhaus-bakery-logo.webp";
import criteriaLogo from "/assets/criteria-coffee-logo.png";
import rumbleLogo from "/assets/rumble-coffee-logo.webp";
import drunkenSailorLogo from "/assets/drunken-sailor-canning-co-logo.webp";
import PageLayout from "./PageLayout";

function Partners() {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

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
    <PageLayout hideImage title="Our Partners">
      <Group p="lg" maw="1440px" dir={isMobile ? "column" : "row"}>
        {suppliers.map((supplier) => (
          <Button
            p="3"
            color="red"
            component="a"
            radius="md"
            variant="light"
            target="_blank"
            h="fit-content"
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
