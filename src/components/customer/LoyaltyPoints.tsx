import { ThemeIcon, Group, Stack, Text, Button, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import OutlineStarIcon from "../../icons/StarOutlineIcon";
import StarFilledIcon from "../../icons/StarFilledIcon";

interface LoyaltyPointsProps {
  additionalPoints: number;
  onClaimFreeCoffee: () => void;
}

function LoyaltyPoints(props: LoyaltyPointsProps) {
  const { additionalPoints, onClaimFreeCoffee } = props;

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const existingPoints = 6;

  const newPointTotal = existingPoints + additionalPoints;

  return (
    <Stack
      p="sm"
      gap="sm"
      w="100%"
      bdrs="sm"
      bg="white"
      align="center"
      bd="darkslategray solid 1px"
    >
      {newPointTotal <= 10 && (
        <>
          <Group gap="3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((point) => {
              let iconColour = "lightgray";
              if (point <= existingPoints) {
                iconColour = "yellow";
              } else if (point <= existingPoints + additionalPoints) {
                iconColour = "gold";
              }

              return (
                <ThemeIcon key={point} radius="100%" bg={iconColour}>
                  {existingPoints >= point ? (
                    <StarFilledIcon />
                  ) : (
                    <OutlineStarIcon />
                  )}
                </ThemeIcon>
              );
            })}
          </Group>

          {newPointTotal < 10 && (
            <Text>
              You're {10 - existingPoints} coffees away from a freebie!
            </Text>
          )}

          {newPointTotal >= 10 && (
            <Text>This order will unlock a free coffee!</Text>
          )}
        </>
      )}

      {existingPoints >= 10 && (
        <>
          <Text>You've unlocked a free coffee!</Text>
          <Button
            fullWidth
            color="yellow"
            variant="filled"
            size={isMobile ? "md" : "xl"}
            onClick={onClaimFreeCoffee}
          >
            Claim Free Coffee!
          </Button>
        </>
      )}
    </Stack>
  );
}

export default LoyaltyPoints;
