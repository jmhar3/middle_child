import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Auth0Provider } from "@auth0/auth0-react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Provider } from "react-redux";

import AboutUs from "./pages/customer/AboutUs.js";
import Partners from "./pages/customer/Partners.js";
import Home from "./pages/customer/Home.js";
import CustomerMenu from "./pages/customer/Menu.js";

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

        <Auth0Provider
          domain={import.meta.env.VITE_AUTH0_DOMAIN}
          clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
          authorizationParams={{
            redirect_uri: window.location.origin,
          }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<Navigate to="/" replace />} />

              {/* Customer Routes */}
              <Route index element={<Home />} />
              <Route path="about-us" element={<AboutUs />} />
              <Route path="about-us/ai" element={<AboutUs />} />
              <Route path="partners" element={<Partners />} />
              <Route path="menu" element={<CustomerMenu />} />

              {/* Private Portal */}
              <Route path="portal">
                <Route index element={<Navigate to="/portal/orders" />} />
                <Route path="orders" element={<Orders />} />
                <Route path="menu" element={<EditMenu />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </Auth0Provider>
      </MantineProvider>
    </Provider>
  </StrictMode>,
);
