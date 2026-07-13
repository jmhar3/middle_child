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
import {
	selectStoreInfo,
	selectStoreInfoStatus,
} from "../../state/storeInfo/storeInfoSlice";
import { fetchStoreInfo } from "../../state/storeInfo/storeInfoThunks";

interface LoyaltyPointsProps {
	additionalPoints?: number;
}

function LoyaltyPoints(props: LoyaltyPointsProps) {
	const { additionalPoints = 0 } = props;

	const dispatch = useAppDispatch();
	const storeInfoStatus = useAppSelector(selectStoreInfoStatus);
	const storeInfo = useAppSelector(selectStoreInfo);
	const userStatus = useAppSelector(selectUserStatus);
	const user = useAppSelector(selectUser);
	const existingPoints = useAppSelector(selectUserLoyaltyPoints);

	const pointsRequired = storeInfo?.loyalty_points;

	useEffect(() => {
		if (userStatus === "idle") {
			dispatch(fetchUser());
		}
		if (storeInfoStatus === "idle") {
			dispatch(fetchStoreInfo());
		}
	}, [dispatch, userStatus, storeInfoStatus]);

	const newPointTotal = existingPoints
		? existingPoints + additionalPoints
		: additionalPoints;

	const existingPointsPercentage =
		pointsRequired && existingPoints
			? (existingPoints / pointsRequired) * 100
			: 0;

	const additionalPointsPercentage =
		pointsRequired && additionalPoints
			? (additionalPoints / pointsRequired) * 100
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

			{pointsRequired && newPointTotal > pointsRequired && (
				<Text>You've unlocked a free coffee!</Text>
			)}

			{pointsRequired && newPointTotal < pointsRequired && (
				<Text>
					You're {pointsRequired - newPointTotal} coffees away from a freebie!
				</Text>
			)}
			{!user && <LoginButton />}
		</Stack>
	);
}

export default LoyaltyPoints;
