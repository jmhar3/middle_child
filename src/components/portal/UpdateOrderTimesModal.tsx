import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { Group, Modal, Stack, Text, TextInput, Divider } from "@mantine/core";

import StyledButton from "../StyledButton";

import { useAppDispatch, useAppSelector } from "../../state/hooks";

import {
	fetchOrderTimes,
	updateOrderTimes,
} from "../../state/orderTimes/orderTimesThunks";

import {
	selectAllOrderTimes,
	selectOrderTimesStatus,
} from "../../state/orderTimes/orderTimesSlice";

interface UpdateOrderTimesModalProps {
	isOpen: boolean;
	onClose: () => void;
}

function UpdateOrderTimesModal(props: UpdateOrderTimesModalProps) {
	const { isOpen, onClose } = props;

	const dispatch = useAppDispatch();
	const orderTimes = useAppSelector(selectAllOrderTimes);
	const orderTimesStatus = useAppSelector(selectOrderTimesStatus);

	const [isUpdatingOrderTimes, setIsUpdatingOrderTimes] = useState(false);
	const [editedOrderTimes, setEditedOrderTimes] = useState(orderTimes);

	useEffect(() => {
		if (orderTimesStatus === "idle") {
			dispatch(fetchOrderTimes());
		}
	}, [dispatch, orderTimesStatus]);

	const updateOrderTime = (time: number) => {
		setEditedOrderTimes((prevOrderTimes) =>
			prevOrderTimes.map((orderTime) => {
				if (orderTime.order === 0) {
					return { ...orderTime, short: time, long: time + 5 };
				} else if (orderTime.order === 1) {
					return { ...orderTime, short: time + 5, long: time + 10 };
				} else {
					return { ...orderTime, short: time + 10, long: time + 20 };
				}
			}),
		);
	};

	const onUpdateOrderTimes = () => {
		setIsUpdatingOrderTimes(true);

		dispatch(updateOrderTimes(editedOrderTimes))
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
			.finally(() => setIsUpdatingOrderTimes(false));
	};

	return (
		<Modal
			centered
			radius="sm"
			opened={isOpen}
			onClose={onClose}
			withCloseButton={false}
			transitionProps={{ transition: "fade", duration: 200 }}
			styles={{
				content: { background: "whitesmoke" },
			}}
		>
			<Stack gap="md" align="center">
				<Text ta="center" size="1.4em" fw="600">
					Update Order Times
				</Text>

				{editedOrderTimes?.map((orderTime) => (
					<>
						{orderTime.order !== 0 && <Divider w="100%" />}
						<Stack key={orderTime.id} gap="sm">
							<Text size="1em" fw="600">
								{orderTime.label}
							</Text>
							<Group grow gap="sm">
								<TextInput
									w="100%"
									size="md"
									label="<5 Coffees"
									value={orderTime.short}
									disabled={orderTime.order !== 0}
									onChange={(event) =>
										orderTime.order === 0 &&
										updateOrderTime(Number(event.target.value))
									}
								/>
								<TextInput
									w="100%"
									size="md"
									label=">5 Coffees / Food"
									value={orderTime.long}
									disabled={true}
								/>
							</Group>
						</Stack>
					</>
				))}

				<Group grow gap="sm" w="100%">
					<StyledButton label="Cancel" variant="outline" onClick={onClose} />

					<StyledButton
						label="Save"
						onClick={onUpdateOrderTimes}
						isLoading={isUpdatingOrderTimes}
					/>
				</Group>
			</Stack>
		</Modal>
	);
}

export default UpdateOrderTimesModal;
