import { Stack, Text, Progress, Flex } from "@mantine/core";

import OutlineStarIcon from "../../icons/StarOutlineIcon";
import StarFilledIcon from "../../icons/StarFilledIcon";

interface LoyaltyPointsProps {
  existingPoints: number;
  additionalPoints: number;
}

function LoyaltyPoints(props: LoyaltyPointsProps) {
  const { existingPoints, additionalPoints } = props;

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
      {newPointTotal <= 12 && (
        <>
          <Flex w="100%" gap="sm" align="center">
            <OutlineStarIcon />

            <Progress.Root size="xl" w="100%">
              <Progress.Section
                value={(existingPoints / 12) * 100}
                color="yellow"
                animated
              />
              <Progress.Section
                value={(additionalPoints / 12) * 100}
                color="gold"
                animated
              />
            </Progress.Root>
            <StarFilledIcon />
          </Flex>

          {newPointTotal < 12 && (
            <Text>
              You're {12 - existingPoints} coffees away from a freebie!
            </Text>
          )}

          {newPointTotal >= 12 && <Text>You've unlocked a free coffee!</Text>}
        </>
      )}

      {existingPoints >= 12 && <Text>You've unlocked a free coffee!</Text>}
    </Stack>
  );
}

export default LoyaltyPoints;
