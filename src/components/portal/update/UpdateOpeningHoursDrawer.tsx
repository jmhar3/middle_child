import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";

import {
	Group,
	Stack,
	Text,
	TextInput,
	Divider,
	Button,
	Flex,
	Drawer,
} from "@mantine/core";

import StyledButton from "../../StyledButton";

import { useAppDispatch, useAppSelector } from "../../../state/hooks";

import {
	fetchStoreInfo,
	updateStoreInfo,
} from "../../../state/storeInfo/storeInfoThunks";

import {
	selectStoreInfo,
	selectStoreInfoStatus,
} from "../../../state/storeInfo/storeInfoSlice";

interface UpdateOpeningHoursModalProps {
	isOpen: boolean;
	onClose: () => void;
}

function UpdateOpeningHoursModal(props: UpdateOpeningHoursModalProps) {
	const { isOpen, onClose } = props;

	const dispatch = useAppDispatch();
	const storeInfo = useAppSelector(selectStoreInfo);
	const storeStatus = useAppSelector(selectStoreInfoStatus);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editedOpeningHours, setEditedOpeningHours] = useState({
		opening_hours: storeInfo?.opening_hours,
		holiday_opening_hours: storeInfo?.holiday_opening_hours,
	});

	useEffect(() => {
		if (storeStatus === "idle") {
			dispatch(fetchStoreInfo());
		}
	}, [dispatch, storeStatus]);

	if (!editedOpeningHours.opening_hours && storeInfo?.opening_hours) {
		setEditedOpeningHours({
			opening_hours: storeInfo?.opening_hours,
			holiday_opening_hours: storeInfo?.holiday_opening_hours,
		});
	}

	const onCloseDrawer = () => {
		setEditedOpeningHours({
			opening_hours: storeInfo?.opening_hours,
			holiday_opening_hours: storeInfo?.holiday_opening_hours,
		});
		onClose();
	};

	const blankHour = { label: "", hours: { from: "", to: "" } };

	const onAddNewOpeningHours = () => {
		setEditedOpeningHours((prevHours) => ({
			...prevHours,
			opening_hours: prevHours.opening_hours
				? [...prevHours.opening_hours, blankHour]
				: [blankHour],
		}));
	};

	const onAddNewHolidayOpeningHours = () => {
		setEditedOpeningHours((prevHours) => ({
			...prevHours,
			holiday_opening_hours: prevHours.holiday_opening_hours
				? [...prevHours.holiday_opening_hours, blankHour]
				: [blankHour],
		}));
	};

	const onRemoveOpeningHours = (label: string) => {
		setEditedOpeningHours((prevHours) => ({
			...prevHours,
			opening_hours: prevHours.opening_hours?.filter(
				(hours) => hours.label !== label,
			),
		}));
	};

	const onRemoveHolidayOpeningHours = (label: string) => {
		setEditedOpeningHours((prevHours) => ({
			...prevHours,
			holiday_opening_hours: prevHours.holiday_opening_hours?.filter(
				(hours) => hours.label !== label,
			),
		}));
	};

	const onUpdateOpeningHours = () => {
		setIsSubmitting(true);

		if (editedOpeningHours)
			dispatch(updateStoreInfo({ id: storeInfo?.id, ...editedOpeningHours }))
				.then(() => {
					notifications.show({
						withCloseButton: false,
						message: "Order times successfully updated",
						position: "bottom-right",
						color: "green",
					});
					onClose();
				})
				.catch((error) =>
					notifications.show({
						message: error,
						withCloseButton: false,
						position: "bottom-right",
						color: "red",
					}),
				)
				.finally(() => setIsSubmitting(false));
	};

	return (
		<Drawer
			offset={12}
			radius="sm"
			position="right"
			opened={isOpen}
			onClose={onCloseDrawer}
			withCloseButton={false}
			trapFocus={false}
		>
			<Stack gap="md" align="center">
				<Text ta="center" size="1.4em" fw="600">
					Update Opening Hours
				</Text>

				{editedOpeningHours.opening_hours?.map((openingHours, index) => (
					<>
						{index !== 0 && <Divider w="100%" />}

						<Stack key={openingHours.label} gap="sm">
							<Flex gap="sm" justify="space-between" align="flex-end">
								<TextInput
									size="md"
									label="Label"
									value={openingHours.label}
									onChange={(event) =>
										setEditedOpeningHours((prevHours) => ({
											...prevHours,
											openingHours: prevHours.opening_hours?.map((hours) =>
												hours.label === openingHours.label
													? {
															label: event.target.value,
															hours: {
																from: hours.hours.from,
																to: hours.hours.to,
															},
														}
													: hours,
											),
										}))
									}
								/>

								<Button
									size="md"
									variant="outline"
									color="darkslategray"
									onClick={() => onRemoveOpeningHours(openingHours.label)}
								>
									Remove
								</Button>
							</Flex>

							<Group grow gap="sm">
								<TextInput
									w="100%"
									size="md"
									label="From"
									value={openingHours.hours.from}
									onChange={(event) =>
										setEditedOpeningHours((prevHours) => ({
											...prevHours,
											openingHours: prevHours.opening_hours?.map((hours) =>
												hours.label === openingHours.label
													? {
															label: hours.label,
															hours: {
																from: event.target.value,
																to: hours.hours.to,
															},
														}
													: hours,
											),
										}))
									}
								/>

								<TextInput
									w="100%"
									size="md"
									label="To"
									value={openingHours.hours.to}
									onChange={(event) =>
										setEditedOpeningHours((prevHours) => ({
											...prevHours,
											openingHours: prevHours.opening_hours?.map((hours) =>
												hours.label === openingHours.label
													? {
															label: hours.label,
															hours: {
																from: hours.hours.from,
																to: event.target.value,
															},
														}
													: hours,
											),
										}))
									}
								/>
							</Group>
						</Stack>
					</>
				))}

				<Button
					w="100%"
					size="lg"
					color="darkslategray"
					onClick={onAddNewOpeningHours}
				>
					Add Opening Hours
				</Button>

				<Divider w="100%" />

				<Text ta="center" size="1.4em" fw="600">
					Update Holiday Opening Hours
				</Text>

				{editedOpeningHours.holiday_opening_hours?.map(
					(openingHours, index) => (
						<>
							{index !== 0 && <Divider w="100%" />}

							<Stack key={openingHours.label} gap="sm">
								<Flex gap="sm" justify="space-between" align="flex-end">
									<TextInput
										size="md"
										label="Label"
										value={openingHours.label}
										onChange={(event) =>
											setEditedOpeningHours((prevHours) => ({
												...prevHours,
												holiday_opening_hours:
													prevHours.holiday_opening_hours?.map((hours) =>
														hours.label === openingHours.label
															? {
																	label: event.target.value,
																	hours: {
																		from: hours.hours.from,
																		to: hours.hours.to,
																	},
																}
															: hours,
													),
											}))
										}
									/>

									<Button
										size="md"
										variant="outline"
										color="darkslategray"
										onClick={() =>
											onRemoveHolidayOpeningHours(openingHours.label)
										}
									>
										Remove
									</Button>
								</Flex>

								<Group grow gap="sm">
									<TextInput
										w="100%"
										size="md"
										label="From"
										value={openingHours.hours.from}
										onChange={(event) =>
											setEditedOpeningHours((prevHours) => ({
												...prevHours,
												holiday_opening_hours:
													prevHours.holiday_opening_hours?.map((hours) =>
														hours.label === openingHours.label
															? {
																	label: hours.label,
																	hours: {
																		from: event.target.value,
																		to: hours.hours.to,
																	},
																}
															: hours,
													),
											}))
										}
									/>
									<TextInput
										w="100%"
										size="md"
										label="To"
										value={openingHours.hours.to}
										onChange={(event) =>
											setEditedOpeningHours((prevHours) => ({
												...prevHours,
												holiday_opening_hours:
													prevHours.holiday_opening_hours?.map((hours) =>
														hours.label === openingHours.label
															? {
																	label: hours.label,
																	hours: {
																		from: hours.hours.from,
																		to: event.target.value,
																	},
																}
															: hours,
													),
											}))
										}
									/>
								</Group>
							</Stack>
						</>
					),
				)}

				<Button
					w="100%"
					size="lg"
					color="darkslategray"
					onClick={onAddNewHolidayOpeningHours}
				>
					Add Holiday Opening Hours
				</Button>

				<Divider w="100%" />

				<Group grow gap="sm" w="100%">
					<StyledButton
						label="Cancel"
						variant="outline"
						onClick={onCloseDrawer}
					/>

					<StyledButton
						label="Save"
						isLoading={isSubmitting}
						onClick={onUpdateOpeningHours}
					/>
				</Group>
			</Stack>
		</Drawer>
	);
}

export default UpdateOpeningHoursModal;
