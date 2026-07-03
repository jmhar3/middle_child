import { Accordion, Box, Text } from "@mantine/core";

import Section from "../../components/portal/menu/sections/Section";

import { selectMenu } from "../../state/menu/menuSlice";
import { useAppSelector } from "../../state/hooks";

function Menu() {
	const menu = useAppSelector(selectMenu);

	return (
		<Box m="sm" bg="white" bdrs="sm">
			<Accordion
				radius="sm"
				variant="contained"
				chevronIconSize={21}
				chevronPosition="left"
			>
				{menu.map((section) => (
					<Accordion.Item key={section.label} value={section.label}>
						<Accordion.Control>
							<Text component="span">{section.label}</Text>
						</Accordion.Control>

						<Accordion.Panel>
							<Section key={section.id} section={section} />
						</Accordion.Panel>
					</Accordion.Item>
				))}
			</Accordion>
		</Box>
	);
}

export default Menu;

// const ProtectedPortal = withAuthenticationRequired(Menu);

// export default ProtectedPortal;
