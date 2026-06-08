import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { Text, Stack, Select, Divider, Modal, Group } from "@mantine/core";

import StyledButton from "../../../StyledButton";

import { useAppDispatch, useAppSelector } from "../../../../state/hooks";
import { selectAllModifiers } from "../../../../state/modifiers/modifiersSlice";
import { deleteModifier } from "../../../../state/modifiers/modifierThunks";

import type { Modifier } from "../../../../state/types";

interface DeleteModifierModalProps {
	isOpen: boolean;
	onClose: () => void;
}

function DeleteModifierModal(props: DeleteModifierModalProps) {
	const { isOpen, onClose } = props;

	const dispatch = useAppDispatch();
	const modifiers = useAppSelector(selectAllModifiers);
	const [modifier, setModifier] = useState<Modifier | undefined>();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const clearDrawer = () => {
		setModifier(undefined);
		onClose();
	};

	const onDeleteModifier = () => {
		setIsSubmitting(true);
		if (modifier) {
			dispatch(deleteModifier(modifier.id))
				.then(() => {
					notifications.show({
						withCloseButton: false,
						message: `${modifier?.label} successfully deleted`,
						position: "bottom-right",
						color: "green",
					});
					clearDrawer();
				})
				.catch((error) =>
					notifications.show({
						message: error,
						withCloseButton: false,
						position: "bottom-right",
						color: "red",
					}),
				);
		}
		setIsSubmitting(false);
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
			<Stack align="flex-end">
				<Text size="1.4em" fw="600" ta="left" w="100%">
					DELETE MODIFIER
				</Text>

				<Divider w="100%" />

				<Select
					w="100%"
					size="md"
					label="Select modifier to edit"
					nothingFoundMessage="No modifiers found matching your search"
					onChange={(value) => {
						const findModifier = modifiers.find(({ id }) => id === value);
						if (findModifier) setModifier(findModifier);
					}}
					data={modifiers.map(({ id, label, price }) => ({
						value: id,
						label: price ? `${label} +$${price.toFixed(2)}` : label,
					}))}
					disabled={isSubmitting}
					searchable
				/>

				<Group>
					<StyledButton
						label="Cancel"
						variant="outline"
						onClick={clearDrawer}
						isDisabled={isSubmitting}
					/>
					<StyledButton
						label="Confirm"
						onClick={onDeleteModifier}
						isDisabled={isSubmitting}
					/>
				</Group>
			</Stack>
		</Modal>
	);
}

export default DeleteModifierModal;
