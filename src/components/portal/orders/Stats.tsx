import { useEffect, useMemo, useState } from "react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import dayjs from "dayjs";
import isYesterday from "dayjs/plugin/isYesterday";

import {
	em,
	Box,
	Text,
	Flex,
	Stack,
	Table,
	Drawer,
	Button,
	Accordion,
	CloseButton,
} from "@mantine/core";

import Loading from "../../Loading";

import { fetchUser } from "../../../state/user/userThunks";
import { fetchOrders } from "../../../state/orders/ordersThunks";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { selectUser, selectUserStatus } from "../../../state/user/userSlice";

import {
	selectOrders,
	selectOrdersStatus,
} from "../../../state/orders/ordersSlice";

import type { MenuItemType, OrderItem } from "../../../state/types";

dayjs.extend(isYesterday);

interface StatData {
	item: MenuItemType;
	quantity: number;
	largeQuantity: number;
	freebies: number;
	total: number;
}

function Stats() {
	const dispatch = useAppDispatch();

	const userStatus = useAppSelector(selectUserStatus);
	const ordersStatus = useAppSelector(selectOrdersStatus);

	const user = useAppSelector(selectUser);
	const orders = useAppSelector(selectOrders);

	const isLoading =
		!orders && (ordersStatus === "pending" || userStatus === "pending");

	useEffect(() => {
		if (userStatus === "idle") {
			dispatch(fetchUser());
		}
		if (user?.is_admin && ordersStatus === "idle") {
			dispatch(fetchOrders());
		}
	}, [user, dispatch, userStatus, ordersStatus]);

	const isMobile = useMediaQuery(`(max-width: ${em(815)})`);
	const [opened, { open, close }] = useDisclosure(false);

	const [todaysStats, setTodaysStats] = useState<StatData[]>([]);
	const [yesterdaysStats, setYesterdaysStats] = useState<StatData[]>([]);
	const [weeksStats, setWeeksStats] = useState<StatData[]>([]);

	const todaysOrders = orders.filter((order) =>
		dayjs(order.due_at).isSame(dayjs(), "day"),
	);

	const yesterdaysOrders = orders.filter((order) =>
		dayjs(order.due_at).isYesterday(),
	);

	const weeksOrders = orders.filter((order) =>
		dayjs(order.due_at).isSame(dayjs(), "isoWeek"),
	);

	const formatStat = (item: OrderItem) => {
		const quantity = item.is_large ? 0 : item.quantity;

		const largeQuantity = item.is_large ? item.quantity : 0;

		const modifiersPrice =
			item.modifiers
				?.flatMap((modifier) => modifier.price || 0)
				.reduce((acc, current) => acc + current, 0) || 0;

		const basePrice = quantity * (item.item.price + modifiersPrice);
		const largePrice =
			largeQuantity * ((item.item.large_price || 0) + modifiersPrice);

		return {
			item: item.item,
			quantity: quantity,
			largeQuantity: largeQuantity,
			freebies: item.contains_freebie || 0,
			total: basePrice + largePrice,
		};
	};

	const formatTodaysStats = () => {
		const todaysItems = todaysOrders.flatMap((order) => order.items);

		todaysItems.forEach((item) => {
			const formattedStat: StatData = formatStat(item);

			setTodaysStats((prevStats) => {
				const existingStat = prevStats.find(
					(stat) => stat.item.id === item.item.id,
				);

				if (existingStat)
					return prevStats.map((stat) =>
						stat.item.id === item.item.id
							? {
									...stat,
									quantity: stat.quantity + formattedStat.quantity,
									largeQuantity:
										stat.largeQuantity + formattedStat.largeQuantity,
									freebies: stat.freebies + formattedStat.freebies,
									total: stat.total + formattedStat.total,
								}
							: stat,
					);
				return [...prevStats, formattedStat];
			});
		});
	};

	const formatYesterdaysStats = () => {
		const yesterdaysItems = yesterdaysOrders.flatMap((order) => order.items);

		yesterdaysItems.forEach((item) => {
			const formattedStat: StatData = formatStat(item);

			setYesterdaysStats((prevStats) => {
				const existingStat = prevStats.find(
					(stat) => stat.item.id === item.item.id,
				);

				if (existingStat)
					return prevStats.map((stat) =>
						stat.item.id === item.item.id
							? {
									...stat,
									quantity: stat.quantity + formattedStat.quantity,
									largeQuantity:
										stat.largeQuantity + formattedStat.largeQuantity,
									freebies: stat.freebies + formattedStat.freebies,
									total: stat.total + formattedStat.total,
								}
							: stat,
					);
				return [...prevStats, formattedStat];
			});
		});
	};

	const formatWeeksStats = () => {
		const weeksItems = weeksOrders.flatMap((order) => order.items);

		weeksItems.forEach((item) => {
			const formattedStat: StatData = formatStat(item);

			setWeeksStats((prevStats) => {
				const existingStat = prevStats.find(
					(stat) => stat.item.id === item.item.id,
				);
				if (existingStat)
					return prevStats.map((stat) =>
						stat.item.id === item.item.id
							? {
									...stat,
									quantity: stat.quantity + formattedStat.quantity,
									largeQuantity:
										stat.largeQuantity + formattedStat.largeQuantity,
									freebies: stat.freebies + formattedStat.freebies,
									total: stat.total + formattedStat.total,
								}
							: stat,
					);
				return [...prevStats, formattedStat];
			});
		});
	};

	if (todaysStats.length === 0 && orders.length > 0) formatTodaysStats();
	if (yesterdaysStats.length === 0 && orders.length > 0)
		formatYesterdaysStats();
	if (weeksStats.length === 0 && orders.length > 0) formatWeeksStats();

	const todaysTotal = useMemo(
		() => todaysOrders.reduce((acc, order) => acc + order.total, 0),
		[todaysOrders],
	);

	const yesterdaysTotal = useMemo(
		() => yesterdaysOrders.reduce((acc, order) => acc + order.total, 0),
		[yesterdaysOrders],
	);

	const weeklyTotal = useMemo(
		() => weeksOrders.reduce((acc, order) => acc + order.total, 0),
		[weeksOrders],
	);

	if (isLoading) return <Loading message="Fetching orders..." />;

	return (
		<>
			<Button
				px="5"
				w="fit-content"
				variant="outline"
				color="darkslategray"
				size={isMobile ? "md" : "lg"}
				onClick={open}
			>
				<Stack gap="0">
					<Flex justify="space-between" gap="xs">
						<Text>Today:</Text>
						<Text>${todaysTotal.toFixed(2)}</Text>
					</Flex>

					<Flex justify="space-between" gap="xs">
						<Text>This Week:</Text>
						<Text>${weeklyTotal.toFixed(2)}</Text>
					</Flex>
				</Stack>
			</Button>

			<Drawer
				size="md"
				offset={12}
				radius="sm"
				position="right"
				withCloseButton={false}
				trapFocus={false}
				opened={opened}
				onClose={close}
			>
				<Stack>
					<Flex w="100%" justify="space-between" align="center">
						<Text size="1.4em" fw="600" ta="left" w="100%">
							STATS
						</Text>

						<CloseButton onClick={close} />
					</Flex>

					<Accordion defaultValue="today">
						<Accordion.Item value="today">
							<Accordion.Control>
								Today: ${todaysTotal.toFixed(2)}
							</Accordion.Control>
							<Accordion.Panel>
								<Box p="sm" bd="solid 1px lightgray" bdrs="md">
									<Table stickyHeader>
										<Table.Caption>
											Quantity is inclusive of freebies
										</Table.Caption>

										<Table.Thead>
											<Table.Tr>
												<Table.Th>Item</Table.Th>
												<Table.Th ta="right">Quantity</Table.Th>
											</Table.Tr>
										</Table.Thead>

										<Table.Tbody>
											{todaysStats.map((stat) => (
												<Table.Tr key={stat.item.id}>
													<Table.Td>{stat.item.label}</Table.Td>
													<Table.Td ta="right">
														{stat.quantity}
														{stat.largeQuantity
															? ` / ${stat.largeQuantity}`
															: ""}
													</Table.Td>
												</Table.Tr>
											))}
										</Table.Tbody>
									</Table>
								</Box>
							</Accordion.Panel>
						</Accordion.Item>

						<Accordion.Item value="yesterday">
							<Accordion.Control>
								Yesterday: ${yesterdaysTotal.toFixed(2)}
							</Accordion.Control>
							<Accordion.Panel>
								<Box p="sm" bd="solid 1px lightgray" bdrs="md">
									<Table stickyHeader>
										<Table.Caption>
											Quantity is inclusive of freebies
										</Table.Caption>

										<Table.Thead>
											<Table.Tr>
												<Table.Th>Item</Table.Th>
												<Table.Th ta="right">Quantity</Table.Th>
											</Table.Tr>
										</Table.Thead>

										<Table.Tbody>
											{yesterdaysStats.map((stat) => (
												<Table.Tr key={stat.item.id}>
													<Table.Td>{stat.item.label}</Table.Td>
													<Table.Td ta="right">
														{stat.quantity}
														{stat.largeQuantity
															? ` / ${stat.largeQuantity}`
															: ""}
													</Table.Td>
												</Table.Tr>
											))}
										</Table.Tbody>
									</Table>
								</Box>
							</Accordion.Panel>
						</Accordion.Item>

						<Accordion.Item value="week">
							<Accordion.Control>
								This Week: ${weeklyTotal.toFixed(2)}
							</Accordion.Control>

							<Accordion.Panel>
								<Box p="sm" bd="solid 1px lightgray" bdrs="md">
									<Table stickyHeader>
										<Table.Caption>
											Quantity is inclusive of freebies
										</Table.Caption>

										<Table.Thead>
											<Table.Tr>
												<Table.Th>Item</Table.Th>
												<Table.Th ta="right">Quantity</Table.Th>
											</Table.Tr>
										</Table.Thead>

										<Table.Tbody>
											{weeksStats.map((stat) => (
												<Table.Tr key={stat.item.id}>
													<Table.Td>{stat.item.label}</Table.Td>
													<Table.Td ta="right">
														{stat.quantity}
														{stat.largeQuantity
															? ` / ${stat.largeQuantity}`
															: ""}
													</Table.Td>
												</Table.Tr>
											))}
										</Table.Tbody>
									</Table>
								</Box>
							</Accordion.Panel>
						</Accordion.Item>
					</Accordion>
				</Stack>
			</Drawer>
		</>
	);
}

export default Stats;
