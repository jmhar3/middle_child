import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import {
	Accordion,
	Divider,
	Flex,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";

import PageLayout from "./PageLayout";
import LoginModal from "../../components/LoginModal";
import StyledButton from "../../components/StyledButton";
import OrderSummary from "../../components/customer/OrderSummary";

import { useAppDispatch, useAppSelector } from "../../state/hooks";

import {
	selectUser,
	selectUserOrders,
	selectUserStatus,
} from "../../state/user/userSlice";

import {
	fetchUser,
	signOutUser,
	updateUser,
} from "../../state/user/userThunks";
import LoyaltyPoints from "../../components/customer/LoyaltyPoints";

function Account() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const userStatus = useAppSelector(selectUserStatus);
	const user = useAppSelector(selectUser);
	const userOrders = useAppSelector(selectUserOrders);

	const [name, setName] = useState(user?.name);

	useEffect(() => {
		if (userStatus === "idle") {
			dispatch(fetchUser());
		}
	}, [dispatch, userStatus]);

	if (userStatus === "succeeded" && user && name === undefined) {
		setName(user.name);
	}

	const isLoading = userStatus === "idle" || userStatus === "pending";

	const onUpdateUserName = () => {
		if (user) {
			dispatch(updateUser({ id: user.id, name: name }));
			dispatch(fetchUser());
		}
	};

	const onSignOut = () => {
		dispatch(signOutUser());
	};

	return (
		<PageLayout title="Account">
			{!user && !isLoading && (
				<LoginModal
					isModalOpen={true}
					onModalClose={() => (user ? navigate("/account") : navigate("/"))}
				/>
			)}
			<Stack w="100%" p="sm">
				<StyledButton
					label="Sign Out"
					onClick={onSignOut}
					isDisabled={isLoading}
				/>

				<Divider />

				<Stack gap="sm">
					<TextInput
						w="100%"
						size="md"
						value={name}
						label="Update Name"
						onChange={(e) => setName(e.target.value)}
					/>

					<StyledButton
						label="Update Name"
						onClick={onUpdateUserName}
						isDisabled={isLoading}
					/>
				</Stack>

				<Divider />

				<LoyaltyPoints />

				{userOrders?.length && userOrders.length > 0 ? (
					<>
						<Divider />

						<Stack bd="solid 1px darkslategray" bdrs="sm" gap="0" p="sm">
							<Text>Order History</Text>

							<Accordion
								styles={{
									item: { borderColor: "darkslategray" },
									content: {
										padding: 0,
										margin: 0,
										backgroundColor: "white",
									},
									control: {
										backgroundColor: "whitesmoke",
									},
								}}
							>
								{userOrders.map((order) => (
									<Accordion.Item key={order.id} value={order.id}>
										<Accordion.Control>
											<Stack component="span">
												<Flex>
													<Stack gap="0">
														<Text>
															{dayjs(order.due_at).format("MMM D h:mma")}
														</Text>
														<Text size="xs">
															{order.items
																.map(({ quantity }) => quantity)
																.reduce(
																	(accumulator, currentValue) =>
																		accumulator + currentValue,
																	0,
																)}{" "}
															items |{" "}
															{order.is_complete ? "Complete" : "In Progress"}
														</Text>
													</Stack>
												</Flex>
											</Stack>
										</Accordion.Control>
										<Accordion.Panel>
											<OrderSummary order={order} />
										</Accordion.Panel>
									</Accordion.Item>
								))}
							</Accordion>
						</Stack>
					</>
				) : (
					<></>
				)}
			</Stack>
		</PageLayout>
	);
}

export default Account;
