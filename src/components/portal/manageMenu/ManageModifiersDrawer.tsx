import { v4 as uuid } from "uuid";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

import {
	Flex,
	Text,
	Group,
	Stack,
	Drawer,
	Switch,
	Select,
	Divider,
	Textarea,
	TextInput,
	NumberInput,
	CloseButton,
} from "@mantine/core";

import StyledButton from "../../StyledButton";

import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { upsertMenuItems } from "../../../state/menuItems/menuItemsThunks";
import { selectAllModifiers } from "../../../state/modifiers/modifiersSlice";
import { deleteModifier } from "../../../state/modifiers/modifierThunks";

import type { Modifier } from "../../../state/types";

interface ManageModifiersDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: (modifier: Modifier) => void;
}

function ManageModifiersDrawer(props: ManageModifiersDrawerProps) {
	const { isOpen, onClose, onSuccess } = props;

	const dispatch = useAppDispatch();
	const modifiers = useAppSelector(selectAllModifiers);

	const [isUpsertingModifier, setIsUpsertingModifier] = useState(false);
	const [showModifierInputs, setShowModifierInputs] = useState(false);
	const [showCodeInput, setShowCodeInput] = useState(false);
	const [selectedModifier, setSelectedModifier] = useState<Modifier | null>(
		null,
	);
	const [editedModifier, setEditedModifier] = useState<Modifier | null>(null);

	const blankModifier: Modifier = {
		id: uuid(),
		label: "",
		price: 0,
		is_ingredient: false,
		order: 0,
	};

	const onCloseDrawer = () => {
		setSelectedModifier(null);
		setShowCodeInput(false);
		setSelectedModifier(null);
		setShowModifierInputs(false);
		onClose();
	};

	const onSelectModifier = (itemId: string | null) => {
		const item = modifiers.find(({ id }) => id === itemId);
		setSelectedModifier(item || null);
	};

	const onEditItem = () => {
		setShowModifierInputs(true);
		if (selectedModifier?.reference_code) setShowCodeInput(true);
		setEditedModifier(selectedModifier ? selectedModifier : blankModifier);
	};

	const onAddNewModifier = () => {
		setSelectedModifier(null);
		setShowCodeInput(false);
		setEditedModifier(blankModifier);
		setShowModifierInputs(true);
	};

	const toggleReferenceCode = (hasReferenceCode: boolean) => {
		setShowCodeInput(hasReferenceCode);
	};

	const toggleIngredient = (hasLarge: boolean) => {
		if (editedModifier)
			setEditedModifier({
				...editedModifier,
				is_ingredient: hasLarge,
			});
	};

	const toggleStock = (isInStock: boolean) => {
		if (editedModifier)
			setEditedModifier({
				...editedModifier,
				is_in_stock: isInStock,
			});
	};

	const onDeleteModifier = () => {
		setIsUpsertingModifier(true);
		if (selectedModifier) {
			dispatch(deleteModifier(selectedModifier.id))
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
		setIsUpsertingModifier(false);
	};

	const onSave = () => {
		setIsUpsertingModifier(true);

		if (editedModifier) {
			if (selectedModifier) {
				dispatch(upsertMenuItems([editedModifier]))
					.then((data) => {
						if (data.payload && onSuccess) onSuccess(data.payload as Modifier);
					})
					.finally(() => {
						setIsUpsertingModifier(false);
					});
				return;
			}
			dispatch(upsertMenuItems([editedModifier]))
				.then((data) => {
					if (data.payload && onSuccess) onSuccess(data.payload as Modifier);
				})
				.finally(() => {
					setIsUpsertingModifier(false);
				});
		}
	};

	return (
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
						MANAGE MODIFIERS
					</Text>

					<CloseButton onClick={onCloseDrawer} />
				</Flex>

				<Divider w="100%" />

				<Stack w="100%" gap="xs" bd="solid 1px lightgray" bdrs="sm" p="sm">
					<Select
						w="100%"
						size="md"
						searchable
						disabled={showModifierInputs}
						label="Select Modifier to Edit"
						nothingFoundMessage="No sections found matching your search"
						value={selectedModifier?.id}
						onChange={onSelectModifier}
						data={modifiers?.map((item) => ({
							value: item.id,
							label: item.label,
						}))}
					/>

					<Group gap="sm" grow>
						<StyledButton
							label="Delete"
							onClick={onDeleteModifier}
							isDisabled={!selectedModifier || showModifierInputs}
							isLoading={isUpsertingModifier}
						/>

						<StyledButton
							label="Edit"
							onClick={onEditItem}
							isDisabled={!selectedModifier || showModifierInputs}
							isLoading={isUpsertingModifier}
						/>
					</Group>

					<Text ta="center">OR</Text>

					<Group gap="sm" grow>
						<StyledButton
							variant="outline"
							label="Create New Modifier"
							onClick={onAddNewModifier}
							isDisabled={showModifierInputs}
							isLoading={isUpsertingModifier}
						/>
					</Group>
				</Stack>

				{showModifierInputs && editedModifier && (
					<Stack w="100%">
						<Stack gap="xs">
							<Flex gap="xs">
								{showCodeInput && (
									<TextInput
										w="210px"
										size="md"
										label="Code"
										value={editedModifier.reference_code}
										onChange={(event) =>
											editedModifier &&
											setEditedModifier({
												...editedModifier,
												reference_code: event.target.value,
											})
										}
									/>
								)}

								<TextInput
									w="100%"
									size="md"
									label="Label"
									value={editedModifier.label}
									onChange={(event) =>
										editedModifier &&
										setEditedModifier({
											...editedModifier,
											label: event.target.value,
										})
									}
								/>

								<NumberInput
									w="210px"
									size="md"
									leftSection="$"
									label="Additional Cost"
									value={editedModifier.price}
									onChange={(price) =>
										editedModifier &&
										setEditedModifier({
											...editedModifier,
											price: typeof price === "string" ? Number(price) : price,
										})
									}
								/>
							</Flex>

							<Switch
								size="md"
								checked={showCodeInput}
								onChange={(event) =>
									toggleReferenceCode(event.currentTarget.checked)
								}
								label="Has Reference Code"
								description="Orders show code by default"
							/>
						</Stack>

						<Divider />

						<Textarea
							w="100%"
							size="md"
							label="Description"
							value={editedModifier.description}
							onChange={(event) =>
								editedModifier &&
								setEditedModifier({
									...editedModifier,
									description: event.target.value,
								})
							}
						/>

						<Group grow gap="sm" align="flex-start">
							<Switch
								size="md"
								checked={editedModifier.is_ingredient}
								onChange={(event) =>
									toggleIngredient(event.currentTarget.checked)
								}
								label="Is Ingredient"
								description="Ingredients are able to be marked as out of stock"
							/>

							{editedModifier.is_ingredient && (
								<Switch
									size="md"
									checked={editedModifier.is_in_stock}
									onChange={(event) => toggleStock(event.currentTarget.checked)}
									label="Is In Stock"
								/>
							)}
						</Group>

						<Group grow gap="sm">
							<StyledButton
								label="Cancel"
								variant="outline"
								onClick={() => {
									setShowModifierInputs(false);
									setShowCodeInput(false);
								}}
								isLoading={isUpsertingModifier}
							/>

							<StyledButton
								label="Confirm"
								onClick={onSave}
								isLoading={isUpsertingModifier}
							/>
						</Group>
					</Stack>
				)}
			</Stack>
		</Drawer>
	);
}

export default ManageModifiersDrawer;
