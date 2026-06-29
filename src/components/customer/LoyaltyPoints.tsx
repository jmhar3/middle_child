import { useEffect } from "react";
import { Stack, Text, Progress, Flex } from "@mantine/core";

import LoginButton from "../Login";

import OutlineStarIcon from "../../icons/StarOutlineIcon";
import StarFilledIcon from "../../icons/StarFilledIcon";

import { fetchUser } from "../../state/user/userThunks";
import { useAppDispatch, useAppSelector } from "../../state/hooks";

import {
	selectUser,
	selectUserLoyaltyPoints,
	selectUserStatus,
} from "../../state/user/userSlice";

interface LoyaltyPointsProps {
	additionalPoints: number;
}

function LoyaltyPoints(props: LoyaltyPointsProps) {
	const { additionalPoints } = props;

	const dispatch = useAppDispatch();
	const userStatus = useAppSelector(selectUserStatus);
	const user = useAppSelector(selectUser);
	const existingPoints = useAppSelector(selectUserLoyaltyPoints);

	useEffect(() => {
		if (userStatus === "idle") {
			dispatch(fetchUser());
		}
	}, [dispatch, userStatus]);

	const newPointTotal = existingPoints
		? existingPoints + additionalPoints
		: additionalPoints;

	const existingPointsPercentage = existingPoints
		? (existingPoints / 12) * 100
		: 0;

	const additionalPointsPercentage = additionalPoints
		? (additionalPoints / 12) * 100
		: 0;

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
			{!user && <LoginButton />}
		</Stack>
	);
}

export default LoyaltyPoints;
