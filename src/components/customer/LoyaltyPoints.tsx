import { Stack, Text, Progress, Flex } from "@mantine/core";

import LoginButton from "../Login";

import OutlineStarIcon from "../../icons/StarOutlineIcon";
import StarFilledIcon from "../../icons/StarFilledIcon";

interface LoyaltyPointsProps {
	existingPoints?: number;
	additionalPoints: number;
}

function LoyaltyPoints(props: LoyaltyPointsProps) {
	const { existingPoints, additionalPoints } = props;

	const newPointTotal = existingPoints
		? existingPoints + additionalPoints
		: additionalPoints;

	const existingPointsPercentage = existingPoints
		? (existingPoints / 12) * 100
		: 0;

	const additionalPointsPercentage = additionalPoints
		? (additionalPoints / 12) * 100
		: 0;

	if (existingPoints)
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
				<Flex w="100%" gap="sm" align="center">
					<OutlineStarIcon />

					<Progress.Root size="xl" w="100%">
						<Progress.Section
							value={existingPointsPercentage}
							color="yellow"
							animated
						/>
						<Progress.Section
							value={additionalPointsPercentage}
							color="gold"
							animated
						/>
					</Progress.Root>
					<StarFilledIcon />
				</Flex>

				{newPointTotal < 12 ? (
					<Text>You're {12 - newPointTotal} coffees away from a freebie!</Text>
				) : (
					<Text>You've unlocked a free coffee!</Text>
				)}
			</Stack>
		);

	return (
		<Stack
			p="sm"
			gap="xs"
			w="100%"
			bdrs="md"
			bg="white"
			align="center"
			bd="darkslategray solid 1px"
		>
			<Flex w="100%" gap="sm" align="center">
				<OutlineStarIcon />

				<Progress.Root size="xl" w="100%">
					<Progress.Section
						value={additionalPointsPercentage}
						color="gold"
						animated
					/>
				</Progress.Root>
				<StarFilledIcon />
			</Flex>
			<Text>You're {12 - newPointTotal} coffees away from a freebie!</Text>
			<LoginButton />
		</Stack>
	);
}

export default LoyaltyPoints;
