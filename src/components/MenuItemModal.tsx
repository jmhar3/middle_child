import { useEffect, useMemo, useState } from "react";
import { useCounter, useMediaQuery } from "@mantine/hooks";
import { v4 as uuid } from "uuid";

import { em, Box, Text, Modal, Stack, Button, Divider } from "@mantine/core";

import ModifierCheckbox from "./customer/ModifierCheckbox";
import ButtonWithPrice from "./customer/ButtonWithPrice";
import SizeSelect from "./customer/SizeSelect";
import NoteInput from "./customer/NoteInput";
import OptionSelect from "./OptionSelect";

import { useAppDispatch, useAppSelector } from "../state/hooks";
import { fetchModifiers } from "../state/modifiers/modifierThunks";

import {
	selectModifierById,
	selectModifiersStatus,
} from "../state/modifiers/modifiersSlice";

import { calculateOrderItemPrice, formatPrice } from "../helpers";
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

	const [showErrors, setShowErrors] = useState(false);
	const [note, setNote] = useState<string | undefined>(orderItem.note);

	const dispatch = useAppDispatch();
	const modifiersStatus = useAppSelector(selectModifiersStatus);
	const batchBean = useAppSelector((state) =>
		selectModifierById(state, "9118221a-fec6-45ec-ac72-c53f5cfe1f44"),
	);

	useEffect(() => {
		if (modifiersStatus === "idle") {
			dispatch(fetchModifiers());
		}
	}, [dispatch, modifiersStatus]);

	const fullCream = useMemo(() => {
		const allModifiers = menuItem.modifierCategories?.flatMap(
			(option) => option.modifiers,
		);
		return allModifiers?.find(({ label }) => label === "Full Cream");
	}, [menuItem]);

	const [selection, setSelection] = useState<OrderItem>({
		...orderItem,
		is_large: orderItem.is_large ?? (menuItem.has_large ? false : undefined),
		modifiers: orderItem.modifiers ?? (fullCream ? [fullCream] : undefined),
	});

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
		() =>
			calculateOrderItemPrice(
				selection.item,
				selection.modifiers,
				selection.is_large,
			),
		[selection],
	);

	const formattedPrice = useMemo(
		() => formatPrice(menuItemPrice * quantity),
		[menuItemPrice, quantity],
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

	const onSizeSelect = (isLarge: boolean) => {
		setSelection((prevSelection) => ({
			...prevSelection,
			is_large: isLarge,
		}));
	};

	const onAddToCart = () => {
		setShowErrors(false);
		if (
			(missingSections?.length ?? 0) > 0 ||
			(menuItem.large_price && selection.is_large === undefined)
		) {
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

				{(menuItem.label.includes("Batch Brew") ||
					menuItem.label.includes("Cold Brew")) &&
					batchBean && (
						<Stack gap="3px" w="100%">
							<Text>Todays Bean</Text>
							<Stack
								p="sm"
								gap="0"
								w="100%"
								bdrs="sm"
								bd="solid 1px darkslategray"
							>
								<Text fw="bold">{batchBean.label}</Text>
								<Text>{batchBean.description}</Text>
							</Stack>
						</Stack>
					)}

				{menuItem.description && (
					<>
						<Text fs="italic">{menuItem.description}</Text>
						<Divider w="100%" />
					</>
				)}

				{menuItem.has_large && menuItem.large_price && (
					<SizeSelect
						onSizeSelect={onSizeSelect}
						largePrice={menuItem.large_price - menuItem.price}
						isErroneous={showErrors && selection.is_large === undefined}
						sizeSelection={selection.is_large ? "large" : "small"}
					/>
				)}

				{sortedOptions?.map((modifierCategory) => (
					<OptionSelect
						key={modifierCategory.id}
						modifierCategory={modifierCategory}
						isErroneous={
							showErrors &&
							missingSections?.some(({ id }) => id === modifierCategory.id)
						}
						selectedModifiers={filterSelectedModifiers(
							modifierCategory.modifiers,
						)}
						onModifierSelect={onModifierSelect}
					/>
				))}

				{menuItem.modifiers && menuItem.modifiers.length > 0 && (
					<ModifierCheckbox
						isRequired={false}
						modifiers={menuItem.modifiers}
						selectedModifiers={filterSelectedModifiers(menuItem.modifiers)}
						onModifierSelect={onModifierSelect}
					/>
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
						price={formattedPrice}
						label={menuItem.is_in_stock ? "Add to order" : "Out of stock"}
						onClick={onAddToCart}
					/>
				</Box>
			</Stack>
		</Modal>
	);
}

export default MenuItemModal;
