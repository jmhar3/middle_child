import { Text, Box, Stack, Flex, Divider } from "@mantine/core";

import PageLayout from "./PageLayout";

import banner from "/assets/partners.jpg";

function ViewMenu() {
	return (
		<PageLayout image={banner} title="Menu">
			<Box p="lg" maw="1440px" w="100%">
				<Stack w="100%">
					<Stack w="100%" gap="sm">
						<Text fw="bold">HOT DRINKS</Text>
						<Flex w="100%" align="center" justify="space-between">
							<Text>Cappuccino</Text>
							<Text>5.5 / 7</Text>
						</Flex>
						<Flex w="100%" align="center" justify="space-between">
							<Text>Latte</Text>
							<Text>5.5 / 7</Text>
						</Flex>
					</Stack>
					<Divider />
					<Stack gap="sm">
						<Text fw="bold">COLD DRINKS</Text>
						<Flex w="100%" align="center" justify="space-between">
							<Text>Iced Latte</Text>
							<Text>6.5 / 7</Text>
						</Flex>
						<Flex w="100%" align="center" justify="space-between">
							<Text>Iced Chocolate</Text>
							<Text>6.5 / 7</Text>
						</Flex>
					</Stack>
					<Divider />
					<Stack gap="sm">
						<Text fw="bold">BRUNCH</Text>
						<Flex w="100%" align="center" justify="space-between">
							<Stack gap="0">
								<Text>Bacon & Egg</Text>
								<Text size="sm">Milk bun roll filled with bacon + egg</Text>
							</Stack>
							<Text>14</Text>
						</Flex>
						<Flex w="100%" align="center" justify="space-between">
							<Stack gap="0">
								<Text>Ham, Cheese, Tomato Toastie</Text>
								<Text size="sm">
									Exactly what it says on the box on white sourdough
								</Text>
							</Stack>
							<Text>14</Text>
						</Flex>
					</Stack>
				</Stack>
			</Box>
		</PageLayout>
	);
}

export default ViewMenu;
