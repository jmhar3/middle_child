import { useState } from "react";
import { Drawer, Stack, Text } from "@mantine/core";

import type { MenuItemType } from "../../state/types";

interface UpdatePricesDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

function UpdatePricesDrawer(props: UpdatePricesDrawerProps) {
	const [newPrices, setNewPrices] = useState<MenuItemType | null>();

	console.log(newPrices);

	const onCloseDrawer = () => {
		props.onClose();
		setNewPrices(null);
	};
	return (
		<Drawer
			offset={12}
			radius="sm"
			position="right"
			opened={props.isOpen}
			onClose={onCloseDrawer}
			withCloseButton={false}
			trapFocus={false}
		>
			<Stack align="flex-end">
				<Text size="1.4em" fw="600" ta="left" w="100%">
					UPDATE BEANS
				</Text>
			</Stack>
		</Drawer>
	);
}

export default UpdatePricesDrawer;
