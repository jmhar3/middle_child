import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { Group, Modal, Stack, Text } from "@mantine/core";

import StyledButton from "../../StyledButton";

import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { updateStoreInfo } from "../../../state/storeInfo/storeInfoThunks";

import {
	selectStoreInfo,
	selectStoreIsOpen,
} from "../../../state/storeInfo/storeInfoSlice";

interface ToggleStoreOpenModalProps {
	isOpen: boolean;
	onClose: () => void;
}

function ToggleStoreOpenModal(props: ToggleStoreOpenModalProps) {
	const { isOpen, onClose } = props;

	const dispatch = useAppDispatch();
	const storeInfo = useAppSelector(selectStoreInfo);
	const storeIsOpen = useAppSelector(selectStoreIsOpen);

	const [isUpdatingStore, setIsUpdatingStore] = useState(false);

	const onUpdateStore = () => {
		setIsUpdatingStore(true);
		dispatch(updateStoreInfo({ ...storeInfo, is_open: !storeIsOpen }))
			.catch((error) =>
				notifications.show({
					message: error,
					withCloseButton: false,
					position: "bottom-right",
					color: "red",
				}),
			)
			.finally(() => {
				setIsUpdatingStore(false);
			});
		onClose();
	};

	return (
		<Modal
			pt="6em"
			centered
			radius="sm"
			onClose={onClose}
			withCloseButton={false}
			opened={isOpen}
			transitionProps={{ transition: "fade", duration: 200 }}
			styles={{
				content: { background: "whitesmoke" },
			}}
		>
			<Stack>
				<Text ta="center" mb="sm" size="1.6em" c="red.9" fw="600">
					{storeIsOpen
						? "Are you sure you want to stop accepting orders?"
						: "Are you sure you're ready to start accepting orders?"}
				</Text>

				<Group grow>
					<StyledButton
						label="Confirm"
						onClick={onUpdateStore}
						isLoading={isUpdatingStore}
					/>
					<StyledButton
						label="Cancel"
						variant="outline"
						onClick={onClose}
						isLoading={isUpdatingStore}
					/>
				</Group>
			</Stack>
		</Modal>
	);
}

export default ToggleStoreOpenModal;
