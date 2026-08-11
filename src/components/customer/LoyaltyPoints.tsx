import { useEffect, useMemo } from "react";
import { Stack, Text, Flex, Title, Center } from "@mantine/core";

import LoginButton from "../Login";

import CoffeeIcon from "../../icons/CoffeeIcon";
import StarOutlineIcon from "../../icons/StarOutlineIcon";
import StarFilledIcon from "../../icons/StarFilledIcon";

import { fetchUser } from "../../state/user/userThunks";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { fetchStoreInfo } from "../../state/storeInfo/storeInfoThunks";

import {
	selectUser,
	selectUserStatus,
	selectUserLoyaltyPoints,
} from "../../state/user/userSlice";

import {
	selectStoreInfo,
	selectStoreInfoStatus,
} from "../../state/storeInfo/storeInfoSlice";

interface LoyaltyPointsProps {
	additionalPoints?: number;
	showProgress?: boolean;
}

function LoyaltyPoints(props: LoyaltyPointsProps) {
	const { additionalPoints = 0, showProgress = true } = props;

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

	const totalPoints = useMemo(
		() => (existingPoints || 0) + (additionalPoints || 0),
		[existingPoints, additionalPoints],
	);

	const remainingPointsRequired = useMemo(() => {
		if (pointsRequired) {
			if (totalPoints <= pointsRequired) {
				return pointsRequired - totalPoints;
			}
			return 0;
		}
	}, [pointsRequired, totalPoints]);

	const additionalPointsToDisplay = useMemo(() => {
		if (pointsRequired) {
			if (totalPoints > pointsRequired) {
				return pointsRequired - (existingPoints || 0);
			}
		}
		return additionalPoints || 0;
	}, [pointsRequired, totalPoints, existingPoints, additionalPoints]);

	return (
		<Stack gap="sm" w="100%" align="center">
			{showProgress && (
				<Flex w="100%" gap="sm" align="center" justify="space-evenly">
					{[...new Array(existingPoints)].map((point) => (
						<Center key={point} c="yellow" h="30px" w="30px">
							<StarFilledIcon />
						</Center>
					))}

					{[...new Array(additionalPointsToDisplay)].map((point) => (
						<Center key={point} c="gold" h="30px" w="30px">
							<StarOutlineIcon />
						</Center>
					))}

					{[...new Array(remainingPointsRequired)].map((point) => (
						<Center key={point} c="lightgray" h="30px" w="30px">
							<CoffeeIcon />
						</Center>
					))}

					{/*<Center c="gold" h="30px" w="30px">
            <CoffeeIcon />
          </Center>*/}
					<Title c="yellow" size="xl">
						FREE
					</Title>
				</Flex>
			)}

			{typeof pointsRequired === "number" &&
			typeof remainingPointsRequired === "number" ? (
				<>
					{remainingPointsRequired > 0 &&
						remainingPointsRequired < pointsRequired && (
							<Text>
								You're {remainingPointsRequired} coffee
								{remainingPointsRequired === 1 ? "" : "s"} away from a freebie!
							</Text>
						)}

					{pointsRequired && remainingPointsRequired === pointsRequired && (
						<Text>Start drinking to earn free coffee!</Text>
					)}

					{remainingPointsRequired === 0 && (
						<Text>You've unlocked a free coffee!</Text>
					)}
				</>
			) : (
				<> </>
			)}

			{!user && <LoginButton />}
		</Stack>
	);
}

export default LoyaltyPoints;
