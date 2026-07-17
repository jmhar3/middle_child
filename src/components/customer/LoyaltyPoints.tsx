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

	const remainingPointsRequired = useMemo(() => {
		if (pointsRequired) {
			return pointsRequired - (existingPoints || 0) - (additionalPoints || 0);
		}
		return pointsRequired;
	}, [pointsRequired, existingPoints, additionalPoints]);

	return (
		<Stack
			p="sm"
			gap="sm"
			w="100%"
			bdrs="sm"
			bg="white"
			align="center"
			bd="lightslategray solid 1px"
		>
			{remainingPointsRequired && (
				<Flex w="100%" gap="sm" align="center" justify="space-evenly">
					{[...new Array(existingPoints)].map((point) => (
						<Center key={point} c="yellow" h="30px" w="30px">
							<StarFilledIcon />
						</Center>
					))}

					{[...new Array(additionalPoints)].map((point) => (
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

			{remainingPointsRequired ? (
				remainingPointsRequired > 0 ? (
					<Text>
						You're {remainingPointsRequired} coffees away from a freebie!
					</Text>
				) : (
					<Text>You've unlocked a free coffee!</Text>
				)
			) : (
				<Text>Start drinking to earn free coffee!</Text>
			)}

			{!user && <LoginButton />}
		</Stack>
	);
}

export default LoyaltyPoints;
