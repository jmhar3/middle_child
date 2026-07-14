import { v4 as uuid } from "uuid";
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

	const formattedHours = {
		opening_hours: storeInfo?.opening_hours.map((hours) => ({
			...hours,
			id: uuid(),
		})),
		holiday_opening_hours: storeInfo?.holiday_opening_hours?.map((hours) => ({
			...hours,
			id: uuid(),
		})),
	};

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editedOpeningHours, setEditedOpeningHours] = useState(formattedHours);

	useEffect(() => {
		if (storeStatus === "idle") {
			dispatch(fetchStoreInfo());
		}
	}, [dispatch, storeStatus]);

	if (!editedOpeningHours.opening_hours && storeInfo?.opening_hours) {
		setEditedOpeningHours(formattedHours);
	}

	const onCloseDrawer = () => {
		setEditedOpeningHours(formattedHours);
		onClose();
	};

	const onEditOpeningHours = (data: {
		id: string;
		label?: string;
		hours?: { from?: string; to?: string };
	}) => {
		setEditedOpeningHours((prevHours) => ({
			...prevHours,
			opening_hours: prevHours.opening_hours?.map((hours) => {
				if (data.id === hours.id)
					return {
						id: data.id,
						label: typeof data.label === "string" ? data.label : hours.label,
						hours: {
							from:
								typeof data.hours?.from === "string"
									? data.hours?.from
									: hours.hours.from,
							to:
								typeof data.hours?.to === "string"
									? data.hours?.to
									: hours.hours.to,
						},
					};
				return hours;
			}),
		}));
	};

	const onEditHolidayOpeningHours = (data: {
		id: string;
		label?: string;
		hours?: { from?: string; to?: string };
	}) => {
		setEditedOpeningHours((prevHours) => ({
			...prevHours,
			holiday_opening_hours: prevHours.holiday_opening_hours?.map((hours) => {
				if (data.id === hours.id)
					return {
						id: data.id,
						label: data.label || hours.label,
						hours: {
							from: data.hours?.from || hours.hours.from,
							to: data.hours?.to || hours.hours.to,
						},
					};
				return hours;
			}),
		}));
	};

	const onAddNewOpeningHours = () => {
		const blankHour = { id: uuid(), label: "", hours: { from: "", to: "" } };
		setEditedOpeningHours((prevHours) => ({
			...prevHours,
			opening_hours: prevHours.opening_hours
				? [...prevHours.opening_hours, blankHour]
				: [blankHour],
		}));
	};

	const onAddNewHolidayOpeningHours = () => {
		const blankHour = { id: uuid(), label: "", hours: { from: "", to: "" } };
		setEditedOpeningHours((prevHours) => ({
			...prevHours,
			holiday_opening_hours: prevHours.holiday_opening_hours
				? [...prevHours.holiday_opening_hours, blankHour]
				: [blankHour],
		}));
	};

	const onRemoveOpeningHours = (id: string) => {
		setEditedOpeningHours((prevHours) => ({
			...prevHours,
			opening_hours: prevHours.opening_hours?.filter(
				(hours) => hours.id !== id,
			),
		}));
	};

	const onRemoveHolidayOpeningHours = (id: string) => {
		setEditedOpeningHours((prevHours) => ({
			...prevHours,
			holiday_opening_hours: prevHours.holiday_opening_hours?.filter(
				(hours) => hours.id !== id,
			),
		}));
	};

	const onUpdateOpeningHours = () => {
		setIsSubmitting(true);

		if (editedOpeningHours) {
			const openingHours = editedOpeningHours.opening_hours?.map(
				({ label, hours }) => ({ label: label, hours: hours }),
			);
			const holidayOpeningHours = editedOpeningHours.holiday_opening_hours?.map(
				({ label, hours }) => ({ label: label, hours: hours }),
			);

			dispatch(
				updateStoreInfo({
					id: storeInfo?.id,
					opening_hours: openingHours,
					holiday_opening_hours: holidayOpeningHours,
				}),
			)
				.then((data) => {
					if (data.payload) {
						notifications.show({
							withCloseButton: false,
							message: "Order times successfully updated",
							position: "bottom-right",
							color: "green",
						});
						onClose();
					}
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
		}
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

						<Stack key={openingHours.id} gap="sm">
							<Flex gap="sm" justify="space-between" align="flex-end">
								<TextInput
									size="md"
									label="Label"
									value={openingHours.label}
									onChange={(event) =>
										onEditOpeningHours({
											id: openingHours.id,
											label: event.target.value,
										})
									}
								/>

								<Button
									size="md"
									variant="outline"
									color="darkslategray"
									onClick={() => onRemoveOpeningHours(openingHours.id)}
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
										onEditOpeningHours({
											id: openingHours.id,
											hours: { from: event.target.value },
										})
									}
								/>

								<TextInput
									w="100%"
									size="md"
									label="To"
									value={openingHours.hours.to}
									onChange={(event) =>
										onEditOpeningHours({
											id: openingHours.id,
											hours: { to: event.target.value },
										})
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

							<Stack key={openingHours.id} gap="sm">
								<Flex gap="sm" justify="space-between" align="flex-end">
									<TextInput
										size="md"
										label="Label"
										defaultValue={openingHours.label}
										onChange={(event) =>
											onEditHolidayOpeningHours({
												id: openingHours.id,
												label: event.target.value,
											})
										}
									/>

									<Button
										size="md"
										variant="outline"
										color="darkslategray"
										onClick={() => onRemoveHolidayOpeningHours(openingHours.id)}
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
											onEditHolidayOpeningHours({
												id: openingHours.id,
												hours: { from: event.target.value },
											})
										}
									/>
									<TextInput
										w="100%"
										size="md"
										label="To"
										value={openingHours.hours.to}
										onChange={(event) =>
											onEditHolidayOpeningHours({
												id: openingHours.id,
												hours: { to: event.target.value },
											})
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
