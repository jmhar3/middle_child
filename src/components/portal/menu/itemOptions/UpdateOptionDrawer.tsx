import { useState } from "react";
import { Text, Stack, Select, Drawer, Divider } from "@mantine/core";

import StyledButton from "../../../StyledButton";
import UpsertOption from "./UpsertOption";

import { useAppSelector } from "../../../../state/hooks";
import { selectAllItemOptions } from "../../../../state/itemOptions/itemOptionsSlice";

import type { ItemOptions } from "../../../../state/types";

interface UpdateOptionDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

function UpdateOptionDrawer(props: UpdateOptionDrawerProps) {
	const { isOpen, onClose } = props;

	const options = useAppSelector(selectAllItemOptions);
	const [optionToEdit, setOptionToEdit] = useState<ItemOptions | undefined>();
	const [editOption, setEditOption] = useState(false);

	const clearDrawer = () => {
		setOptionToEdit(undefined);
		setEditOption(false);
		onClose();
	};

	return (
		<Drawer
			offset={12}
			radius="sm"
			position="right"
			opened={isOpen}
			onClose={clearDrawer}
			withCloseButton={false}
			trapFocus={false}
		>
			<Stack align="flex-end">
				<Text size="1.4em" fw="600" ta="left" w="100%">
					EDIT OPTIONS
				</Text>

				<Divider w="100%" />

				<Stack w="100%">
					<Select
						w="100%"
						size="md"
						label="Select option to edit"
						nothingFoundMessage="No option found matching your search"
						onChange={(value) => {
							const findItemOption = options.find(({ id }) => id === value);
							if (findItemOption) setOptionToEdit(findItemOption);
						}}
						data={options.map(({ id, label }) => ({
							value: id,
							label: label,
						}))}
						disabled={editOption}
						searchable
					/>
					<StyledButton
						label="Edit Modifier Category"
						onClick={() => setEditOption(true)}
						isDisabled={editOption}
					/>
				</Stack>

				{editOption && optionToEdit && (
					<>
						<Divider w="100%" />

						<UpsertOption itemOption={optionToEdit} onClose={clearDrawer} />
					</>
				)}
			</Stack>
		</Drawer>
	);
}

export default UpdateOptionDrawer;
