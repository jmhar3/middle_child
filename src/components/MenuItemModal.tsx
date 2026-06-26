import { useMemo, useState } from "react";
import { useCounter, useMediaQuery } from "@mantine/hooks";
import { v4 as uuid } from "uuid";

import {
	em,
	Box,
	Text,
	Image,
	Modal,
	Stack,
	Button,
	Divider,
} from "@mantine/core";

import ModifierCheckbox from "./customer/ModifierCheckbox";
import ButtonWithPrice from "./customer/ButtonWithPrice";
import ModifierRadio from "./customer/ModifierRadio";
import NoteInput from "./customer/NoteInput";

import { calculateOrderItemPrice } from "../helpers";

import type { Modifier, OrderItem, MenuItemType } from "../state/types";

interface MenuItemModalProps {
	isOpen: boolean;
	onClose: () => void;
	menuItem: MenuItemType;
	onAddToOrder: (item: OrderItem) => void;
	orderItem?: OrderItem;
}

function MenuItemModal(props: MenuItemModalProps) {
	const {
		isOpen,
		onClose,
		menuItem,
		onAddToOrder,
		orderItem = {
			id: uuid(),
			quantity: 1,
			item: menuItem,
		},
	} = props;

	const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

	const [quantity, { increment, decrement, reset }] = useCounter(
		orderItem.quantity,
		{ min: 1 },
	);

	const [note, setNote] = useState<string | undefined>(orderItem.note);
	const [selection, setSelection] = useState<OrderItem>(orderItem);
	const [showErrors, setShowErrors] = useState(false);

	const sortedOptions =
		menuItem.modifierCategories &&
		[...menuItem.modifierCategories].sort((a, b) => {
			return (a.order || 1) - (b.order || 1);
		});

	const onModalClose = () => {
		reset();
		onClose();
	};

	const onModifierSelect = (modifier: Modifier, isSelected: boolean) => {
		if (isSelected) {
			setSelection((prevSelection) => ({
				...prevSelection,
				modifiers: [...(prevSelection.modifiers || []), modifier],
			}));
		} else {
			setSelection((prevSelection) => ({
				...prevSelection,
				modifiers: prevSelection.modifiers?.filter((m) => m.id !== modifier.id),
			}));
		}
	};

	const filterSelectedModifiers = (modifierOptions: Modifier[]) =>
		selection.modifiers?.filter((selectedModifier) =>
			modifierOptions.includes(selectedModifier),
		);

	const menuItemPrice = useMemo(
		() => calculateOrderItemPrice(selection.item, selection.modifiers),
		[selection],
	);

	const missingSections = useMemo(() => {
		const optionsRequired = sortedOptions?.filter(
			(option) => option.is_required,
		);

		const missingRequiredOptions = optionsRequired?.map((option) => {
			const findSelection = selection.modifiers?.some((modifier) =>
				option.modifiers.some(
					(optionModifier) => optionModifier.id === modifier.id,
				),
			);

			if (!findSelection) {
				return option;
			}
			return undefined;
		});

		return missingRequiredOptions?.filter((item) => item !== undefined);
	}, [selection, sortedOptions]);

	const onAddToCart = () => {
		setShowErrors(false);
		if (missingSections?.length && missingSections?.length > 0) {
			setShowErrors(true);
		} else {
			onAddToOrder({ ...selection, note: note, quantity: quantity });
			onModalClose();
		}
	};

	return (
		<Modal
			fullScreen
			radius="sm"
			opened={isOpen}
			onClose={onModalClose}
			title={menuItem.label.toUpperCase()}
			transitionProps={{ transition: "fade", duration: 200 }}
			styles={{
				header: { background: "whitesmoke" },
				content: { background: "whitesmoke" },
			}}
		>
			<Stack pb={60} align="center">
				<Divider w="100%" />
				{menuItem.description && (
					<>
						<Text fs="italic">{menuItem.description}</Text>
						<Divider w="100%" />
					</>
				)}
				{menuItem.image && <Image w="100%" radius="sm" src={menuItem.image} />}

				{menuItem.modifiers && menuItem.modifiers.length > 0 && (
					<ModifierCheckbox
						isRequired={false}
						modifiers={menuItem.modifiers}
						selectedModifiers={filterSelectedModifiers(menuItem.modifiers)}
						onModifierSelect={onModifierSelect}
					/>
				)}

				{sortedOptions?.map((modifierCategory) =>
					modifierCategory.allow_multiple_selections ? (
						<ModifierCheckbox
							key={modifierCategory.label}
							onModifierSelect={onModifierSelect}
							isRequired={modifierCategory.is_required}
							selectedModifiers={filterSelectedModifiers(
								modifierCategory.modifiers,
							)}
							isErroneous={
								showErrors &&
								missingSections?.some(({ id }) => id === modifierCategory.id)
							}
							{...modifierCategory}
						/>
					) : (
						<ModifierRadio
							key={modifierCategory.label}
							onModifierSelect={onModifierSelect}
							isRequired={modifierCategory.is_required}
							selectedModifiers={filterSelectedModifiers(
								modifierCategory.modifiers,
							)}
							isErroneous={
								showErrors &&
								missingSections?.some(({ id }) => id === modifierCategory.id)
							}
							{...modifierCategory}
						/>
					),
				)}

				<NoteInput label="Notes" note={note} setNote={setNote} />

				<Button.Group w="100%" pt="3">
					<Button
						fullWidth
						radius="sm"
						variant="filled"
						color="darkslategray"
						onClick={decrement}
					>
						-
					</Button>
					<Button.GroupSection
						w="100%"
						bg="white"
						color="darkslategray"
						variant="outline"
					>
						{quantity}
					</Button.GroupSection>
					<Button
						fullWidth
						radius="sm"
						variant="filled"
						color="darkslategray"
						onClick={increment}
					>
						+
					</Button>
				</Button.Group>

				<Box
					w="100%"
					pos="fixed"
					bottom="0"
					px={isMobile ? "md" : "lg"}
					pb={isMobile ? "md" : "lg"}
				>
					<ButtonWithPrice
						isDisabled={!menuItem.is_in_stock}
						price={menuItemPrice * quantity}
						label={menuItem.is_in_stock ? "Add to order" : "Out of stock"}
						onClick={onAddToCart}
					/>
				</Box>
			</Stack>
		</Modal>
	);
}

export default MenuItemModal;
