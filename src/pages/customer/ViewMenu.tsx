import { useEffect } from "react";
import { Text, Stack, Flex, Accordion, Divider } from "@mantine/core";

import PageLayout from "./PageLayout";

import banner from "/assets/partners.jpg";

import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { fetchMenu } from "../../state/menu/menuThunks";
import { fetchItemOptions } from "../../state/itemOptions/itemOptionThunks";
import { selectMenu, selectMenuStatus } from "../../state/menu/menuSlice";

import {
	selectItemOptionById,
	selectItemOptionsStatus,
} from "../../state/itemOptions/itemOptionsSlice";

function ViewMenu() {
	const beansOptionsId = "65a5b843-8815-4c9d-b2d0-5e510f48d4fa";

	const dispatch = useAppDispatch();
	const menuStatus = useAppSelector(selectMenuStatus);
	const menu = useAppSelector(selectMenu);
	const itemOptionsStatus = useAppSelector(selectItemOptionsStatus);
	const beans = useAppSelector((state) =>
		selectItemOptionById(state, beansOptionsId),
	);

	useEffect(() => {
		if (menuStatus === "idle") {
			dispatch(fetchMenu());
		}
		if (itemOptionsStatus === "idle") {
			dispatch(fetchItemOptions());
		}
	}, [dispatch, menuStatus, itemOptionsStatus]);

	return (
		<PageLayout image={banner} title="Menu">
			<Stack maw="1440px" w="100%">
				<Accordion>
					{beans && (
						<Accordion.Item value="beans">
							<Accordion.Control>Todays Beans</Accordion.Control>
							<Accordion.Panel>
								<Stack>
									<Stack w="100%" gap="xs">
										<Text>Milk Coffee</Text>
										<Stack
											w="100%"
											gap="0"
											bdrs="sm"
											bd="solid 1px darkslategray"
										>
											<Stack gap="0" p="sm">
												<Text fw="bold">Espresso Blend</Text>
												<Text>
													Medium-Dark Roast | Berries, Cocoa, Mandarin
												</Text>
											</Stack>
										</Stack>
									</Stack>

									<Stack w="100%" gap="xs">
										<Text>Black Coffee</Text>
										<Stack
											w="100%"
											gap="0"
											bdrs="sm"
											bd="solid 1px darkslategray"
										>
											{beans.modifiers.map((bean, index) => (
												<>
													{index !== 0 && <Divider my="0" />}
													<Stack key={bean.id} gap="0" p="sm">
														<Text fw="bold">{bean.label}</Text>
														<Text>{bean.description}</Text>
													</Stack>
												</>
											))}
										</Stack>
									</Stack>
								</Stack>
							</Accordion.Panel>
						</Accordion.Item>
					)}
					{menu.map((section) => (
						<Accordion.Item key={section.id} value={section.id}>
							<Accordion.Control>{section.label}</Accordion.Control>
							<Accordion.Panel>
								<Stack gap="sm">
									{section.items.map((item) => (
										<Flex
											key={item.id}
											w="100%"
											gap="sm"
											align="center"
											justify="space-between"
										>
											<Stack gap="0">
												<Text>{item.label}</Text>
												<Text size="sm">{item.description}</Text>
											</Stack>
											<Text>
												{item.price === 0 ? "FREE" : item.price}
												{item.large_price &&
													` / ${item.price + item.large_price}`}
											</Text>
										</Flex>
									))}
								</Stack>
							</Accordion.Panel>
						</Accordion.Item>
					))}
				</Accordion>
			</Stack>
		</PageLayout>
	);
}

export default ViewMenu;
