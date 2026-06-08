import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Provider } from "react-redux";

import AboutUs from "./pages/customer/AboutUs.js";
import Partners from "./pages/customer/Partners.js";
import Home from "./pages/customer/Home.js";
import CustomerMenu from "./pages/customer/Menu.js";
import Account from "./pages/customer/Account.js";

import Orders from "./pages/portal/Orders.js";
import EditMenu from "./pages/portal/Menu.js";

import { store } from "./state/store.js";

// @ts-expect-error ignore type error
import "@fontsource/bangers";
// @ts-expect-error ignore type error
import "@fontsource/poppins";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./global.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<MantineProvider>
				<Notifications />
				<BrowserRouter>
					<Routes>
						<Route path="*" element={<Navigate to="/" replace />} />

						{/* Customer Routes */}
						<Route index element={<Home />} />
						<Route path="about-us" element={<AboutUs />} />
						<Route path="about-us/ai" element={<AboutUs />} />
						<Route path="partners" element={<Partners />} />
						<Route path="menu" element={<CustomerMenu />} />
						<Route path="account" element={<Account />} />

						{/* Private Portal */}
						<Route path="portal">
							<Route index element={<Navigate to="/portal/orders" />} />
							<Route path="orders" element={<Orders />} />
							<Route path="menu" element={<EditMenu />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</MantineProvider>
		</Provider>
	</StrictMode>,
);
