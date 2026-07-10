import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import {
	Box,
	em,
	Flex,
	Group,
	SegmentedControl,
	Stack,
	Tabs,
	Text,
	Title,
} from "@mantine/core";

import Menu from "./Menu";
import Orders from "./Orders";
import Loading from "../../components/Loading";
import LoginModal from "../../components/LoginModal";
import StyledButton from "../../components/StyledButton";
import ManageMenu from "../../components/portal/ManageMenu";
import OrdersNavItems from "../../components/portal/OrdersNavItems";

import { useAppDispatch, useAppSelector } from "../../state/hooks";

import { selectMenu, selectMenuStatus } from "../../state/menu/menuSlice";
import { selectUser, selectUserStatus } from "../../state/user/userSlice";
import { selectModifiersStatus } from "../../state/modifiers/modifiersSlice";
import { selectItemOptionsStatus } from "../../state/itemOptions/itemOptionsSlice";

import { fetchMenu } from "../../state/menu/menuThunks";
import { fetchUser, signOutUser } from "../../state/user/userThunks";
import { fetchModifiers } from "../../state/modifiers/modifierThunks";
import { fetchItemOptions } from "../../state/itemOptions/itemOptionThunks";
import { fetchOrderTimes } from "../../state/orderTimes/orderTimesThunks";
import { fetchStoreInfo } from "../../state/storeInfo/storeInfoThunks";
import { fetchOrders } from "../../state/orders/ordersThunks";
import { selectOrderTimesStatus } from "../../state/orderTimes/orderTimesSlice";

import {
	selectOrders,
	selectOrdersStatus,
} from "../../state/orders/ordersSlice";

import {
	selectStoreInfo,
	selectStoreInfoStatus,
} from "../../state/storeInfo/storeInfoSlice";

function Portal() {
	const isMobile = useMediaQuery(`(max-width: ${em(815)})`);
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const route = pathname.replace("/portal/", "");

	const [
		showToggleStoreOpenModal,
		{ open: openToggleStoreOpenModal, close: closeToggleStoreOpenModal },
	] = useDisclosure(false);

	const [activeTab, setActiveTab] = useState<string>(route);

	const dispatch = useAppDispatch();

	const userStatus = useAppSelector(selectUserStatus);
	const menuStatus = useAppSelector(selectMenuStatus);
	const modifiersStatus = useAppSelector(selectModifiersStatus);
	const itemOptionsStatus = useAppSelector(selectItemOptionsStatus);
	const orderTimesStatus = useAppSelector(selectOrderTimesStatus);
	const storeInfoStatus = useAppSelector(selectStoreInfoStatus);
	const ordersStatus = useAppSelector(selectOrdersStatus);

	const user = useAppSelector(selectUser);
	const menu = useAppSelector(selectMenu);
	const orders = useAppSelector(selectOrders);
	const storeInfo = useAppSelector(selectStoreInfo);

	const isLoading =
		!menu &&
		!orders &&
		!storeInfo &&
		(menuStatus === "pending" ||
			modifiersStatus === "pending" ||
			itemOptionsStatus === "pending" ||
			storeInfoStatus === "pending" ||
			orderTimesStatus === "pending" ||
			ordersStatus === "pending" ||
			userStatus === "pending");

	useEffect(() => {
		if (userStatus === "idle") {
			dispatch(fetchUser());
		}
		if (user?.is_admin && itemOptionsStatus === "idle") {
			dispatch(fetchItemOptions());
		}
		if (user?.is_admin && menuStatus === "idle") {
			dispatch(fetchMenu());
		}
		if (user?.is_admin && modifiersStatus === "idle") {
			dispatch(fetchModifiers());
		}
		if (user?.is_admin && orderTimesStatus === "idle") {
			dispatch(fetchOrderTimes());
		}
		if (user?.is_admin && storeInfoStatus === "idle") {
			dispatch(fetchStoreInfo());
		}
		if (user?.is_admin && ordersStatus === "idle") {
			dispatch(fetchOrders());
		}
	}, [
		user,
		dispatch,
		userStatus,
		menuStatus,
		modifiersStatus,
		itemOptionsStatus,
		orderTimesStatus,
		storeInfoStatus,
		ordersStatus,
	]);

	if (userStatus === "idle" || userStatus === "pending")
		return <Loading message="Loading... Please wait" />;
	if (!user) return <LoginModal isModalOpen={true} onModalClose={() => {}} />;

	const onChangeTab = (tab: string) => {
		setActiveTab(tab);
		navigate(`/portal/${tab}`);
	};

	if (user.is_admin)
		return (
			<Box mih="100vh">
				<Flex
					p="sm"
					gap="sm"
					w="100vw"
					top="0px"
					pos="fixed"
					bg="white"
					align="center"
					justify="space-between"
				>
					<SegmentedControl
						size="lg"
						radius="sm"
						value={activeTab}
						onChange={onChangeTab}
						data={[
							{ label: "Orders", value: "orders" },
							{ label: "Menu", value: "menu" },
						]}
					/>

					<Group gap="sm" w="fit-content">
						{activeTab === "orders" && (
							<OrdersNavItems
								openToggleStoreOpenModal={openToggleStoreOpenModal}
							/>
						)}

						<ManageMenu />
					</Group>
				</Flex>
				<Tabs value={activeTab}>
					<Tabs.Panel value="menu">
						<Stack pt={isMobile ? "4em" : "5.2em"} pb="lg" w="100vw">
							{isLoading ? <Loading message="Loading menu" /> : <Menu />}
						</Stack>
					</Tabs.Panel>
					<Tabs.Panel value="orders">
						<Stack pt={isMobile ? "4em" : "5.2em"} pb="lg" w="100vw">
							{isLoading ? (
								<Loading message="Loading orders" />
							) : (
								<Orders
									openToggleStoreOpenModal={openToggleStoreOpenModal}
									showToggleStoreOpenModal={showToggleStoreOpenModal}
									closeToggleStoreOpenModal={closeToggleStoreOpenModal}
								/>
							)}
						</Stack>
					</Tabs.Panel>
				</Tabs>
			</Box>
		);

	return (
		<Stack align="center" py="9em">
			<Stack gap="xs" align="center">
				<Title size="1.8em">This route requires admin permissions.</Title>
				<Text size="1.2em">
					Try logging in to a different account or return to the menu.
				</Text>
			</Stack>

			<Flex gap="md">
				<StyledButton label="Logout" onClick={() => dispatch(signOutUser())} />
				<StyledButton label="Menu" onClick={() => navigate("/")} />
			</Flex>
		</Stack>
	);
}

export default Portal;
