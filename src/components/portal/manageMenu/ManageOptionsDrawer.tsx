import { v4 as uuid } from "uuid";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

import {
	Flex,
	Text,
	Group,
	Stack,
	Drawer,
	Select,
	Divider,
	TextInput,
	CloseButton,
	Switch,
	MultiSelect,
} from "@mantine/core";

import StyledButton from "../../StyledButton";
import ManageModifiersDrawer from "./ManageModifiersDrawer";

import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { upsertMenuItems } from "../../../state/menuItems/menuItemsThunks";
import { selectAllItemOptions } from "../../../state/itemOptions/itemOptionsSlice";
import { selectAllModifiers } from "../../../state/modifiers/modifiersSlice";
import { deleteOption } from "../../../state/itemOptions/itemOptionThunks";

import type { ItemOptions, Modifier } from "../../../state/types";

interface ManageOptionsDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: (option: ItemOptions) => void;
}

function ManageOptionsDrawer(props: ManageOptionsDrawerProps) {
	const { isOpen, onClose, onSuccess } = props;

	const dispatch = useAppDispatch();
	const options = useAppSelector(selectAllItemOptions);
	const modifiers = useAppSelector(selectAllModifiers);

	const [showManageModifierDrawer, setShowManageModifierDrawer] =
		useState(false);
	const [isUpsertingOption, setIsUpsertingOption] = useState(false);
	const [showOptionInputs, setShowOptionInputs] = useState(false);
	const [selectedOption, setSelectedOption] = useState<ItemOptions | null>(
		null,
	);
	const [editedOption, setEditedOption] = useState<ItemOptions | null>(null);

	const blankOption: ItemOptions = {
		id: uuid(),
		label: "",
		is_required: false,
		allow_multiple_selections: false,
		modifiers: [],
		order: 0,
	};

	const onCloseDrawer = () => {
		setSelectedOption(null);
		setSelectedOption(null);
		setShowOptionInputs(false);
		onClose();
	};

	const onSelectOption = (itemId: string | null) => {
		const item = options.find(({ id }) => id === itemId);
		setSelectedOption(item || null);
	};

	const onEditItem = () => {
		setShowOptionInputs(true);
		setEditedOption(selectedOption ? selectedOption : blankOption);
	};

	const onAddNewOption = () => {
		setSelectedOption(null);
		setEditedOption(blankOption);
		setShowOptionInputs(true);
	};

	const toggleIsRequired = (hasLarge: boolean) => {
		if (editedOption)
			setEditedOption({
				...editedOption,
				is_required: hasLarge,
			});
	};

	const toggleAllowMultiple = (hasLarge: boolean) => {
		if (editedOption)
			setEditedOption({
				...editedOption,
				allow_multiple_selections: hasLarge,
			});
	};

	const onSelectModifiers = (modifierIds: string[]) => {
		const selectedModifiers = modifiers.filter(({ id }) =>
			modifierIds.some((modifierId) => modifierId === id),
		);

		if (editedOption)
			setEditedOption({
				...editedOption,
				modifiers: selectedModifiers,
			});
	};

	const onDeleteOption = () => {
		setIsUpsertingOption(true);
		if (selectedOption) {
			dispatch(deleteOption(selectedOption.id))
				.then((data) => {
					if (data.payload) {
						notifications.show({
							withCloseButton: false,
							message: "Options successfully updated",
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
				);
		}
		setIsUpsertingOption(false);
	};

	const onSave = () => {
		setIsUpsertingOption(true);
		if (selectedOption && editedOption) {
			dispatch(upsertMenuItems([editedOption])).then((data) => {
				if (data.payload && onSuccess) onSuccess(data.payload as ItemOptions);
			});
		} else if (editedOption) {
			dispatch(upsertMenuItems([editedOption])).then((data) => {
				if (data.payload && onSuccess) onSuccess(data.payload as ItemOptions);
			});
		}
		setIsUpsertingOption(false);
	};

	return (
		<>
			{showManageModifierDrawer && (
				<ManageModifiersDrawer
					isOpen={showManageModifierDrawer}
					onClose={() => setShowManageModifierDrawer(false)}
					onSuccess={(modifier: Modifier) => onSelectModifiers([modifier.id])}
				/>
			)}

			<Drawer
				size="100%"
				offset={12}
				radius="sm"
				position="right"
				opened={isOpen}
				onClose={onCloseDrawer}
				withCloseButton={false}
				trapFocus={false}
			>
				<Stack align="flex-end">
					<Flex w="100%" justify="space-between" align="center">
						<Text size="1.4em" fw="600" ta="left" w="100%">
							MANAGE OPTIONS
						</Text>

						<CloseButton onClick={onCloseDrawer} />
					</Flex>

					<Divider w="100%" />

					<Stack w="100%" gap="xs" bd="solid 1px lightgray" bdrs="sm" p="sm">
						<Select
							w="100%"
							size="md"
							searchable
							disabled={showOptionInputs}
							label="Select Option to Edit"
							nothingFoundMessage="No sections found matching your search"
							value={selectedOption?.id}
							onChange={onSelectOption}
							data={options?.map((item) => ({
								value: item.id,
								label: item.label,
							}))}
						/>

						<Group gap="sm" grow>
							<StyledButton
								label="Delete"
								onClick={onDeleteOption}
								isDisabled={!selectedOption || showOptionInputs}
								isLoading={isUpsertingOption}
							/>

							<StyledButton
								label="Edit"
								onClick={onEditItem}
								isDisabled={!selectedOption || showOptionInputs}
								isLoading={isUpsertingOption}
							/>
						</Group>

						<Text ta="center">OR</Text>

						<Group gap="sm" grow>
							<StyledButton
								variant="outline"
								label="Create New Option"
								onClick={onAddNewOption}
								isDisabled={showOptionInputs}
								isLoading={isUpsertingOption}
							/>
						</Group>
					</Stack>

					{showOptionInputs && editedOption && (
						<Stack w="100%">
							<TextInput
								w="100%"
								size="md"
								label="Label"
								value={editedOption.label}
								onChange={(event) =>
									editedOption &&
									setEditedOption({
										...editedOption,
										label: event.target.value,
									})
								}
							/>

							<TextInput
								w="100%"
								size="md"
								label="Note"
								description="Internal note for your reference. Not shown to customer."
								value={editedOption.internal_note}
								onChange={(event) =>
									editedOption &&
									setEditedOption({
										...editedOption,
										internal_note: event.target.value,
									})
								}
							/>

							<Group grow gap="sm">
								<Switch
									size="sm"
									checked={editedOption.allow_multiple_selections}
									onChange={(event) =>
										toggleAllowMultiple(event.currentTarget.checked)
									}
									label="Allow Multiple Selections"
									description="Customers may select more than one modifier"
								/>

								<Switch
									size="sm"
									checked={editedOption.is_required}
									onChange={(event) =>
										toggleIsRequired(event.currentTarget.checked)
									}
									label="Is Required"
									description="Customers must select an option to add item to cart"
								/>
							</Group>

							<Stack
								w="100%"
								gap="sm"
								bd="solid 2px lightgray"
								bdrs="sm"
								p="sm"
							>
								<MultiSelect
									w="100%"
									size="md"
									label="Modifiers"
									placeholder="Select item modifiers"
									nothingFoundMessage="No modifiers found matching your search"
									value={editedOption.modifiers?.map(({ id }) => id)}
									onChange={onSelectModifiers}
									data={modifiers?.map((modifier) => ({
										value: modifier.id,
										label: modifier.label,
									}))}
									hidePickedOptions
									searchable
								/>

								<Group grow gap="sm">
									<StyledButton
										label="Add New Modifier"
										onClick={() => setShowManageModifierDrawer(true)}
									/>
								</Group>
							</Stack>

							<Group grow gap="sm">
								<StyledButton
									label="Cancel"
									variant="outline"
									onClick={() => setShowOptionInputs(false)}
									isLoading={isUpsertingOption}
								/>

								<StyledButton
									label="Confirm"
									onClick={onSave}
									isLoading={isUpsertingOption}
								/>
							</Group>
						</Stack>
					)}
				</Stack>
			</Drawer>
		</>
	);
}

export default ManageOptionsDrawer;
