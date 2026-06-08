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

	const onUpdateUserName = () => {
		dispatch(updateUser({ ...user, name: name }));
	};

	const onSignOut = () => {
		dispatch(signOutUser());
	};

	if (!user)
		return (
			<LoginModal
				isModalOpen={true}
				onModalClose={() => (user ? navigate("/account") : navigate("/"))}
			/>
		);

	return (
		<PageLayout title="Account">
			<Stack w="100%" p="sm">
				<Stack w="100%">
					<StyledButton label="Sign Out" onClick={onSignOut} />

					<Divider />

					<Stack gap="sm">
						<TextInput
							w="100%"
							size="md"
							value={name}
							label="Update Name"
							onChange={(e) => setName(e.target.value)}
						/>
						<StyledButton label="Update Name" onClick={onUpdateUserName} />
					</Stack>
				</Stack>

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
						{userOrders?.map((order) => (
							<Accordion.Item key={order.id} value={order.id}>
								<Accordion.Control>
									<Stack component="span">
										<Flex>
											<Stack gap="0">
												<Text>{dayjs(order.due_at).format("MMM D h:mma")}</Text>
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
									<Stack gap="0">
										{order.items.map((item, index) => (
											<>
												{index > 0 && <Divider />}
												<Stack gap="0" key={item.id} p="sm">
													<Text>
														{item.quantity} x {item.item.label}
													</Text>
													{item.modifiers && (
														<Text size="sm">
															{item.modifiers
																.map(({ label }) => label)
																.join(", ")}
														</Text>
													)}

													{item.note && <Text>{item.note}</Text>}
												</Stack>
											</>
										))}
									</Stack>
								</Accordion.Panel>
							</Accordion.Item>
						))}
					</Accordion>
				</Stack>
			</Stack>
		</PageLayout>
	);
}

export default Account;
