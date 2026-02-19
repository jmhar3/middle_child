import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Auth0Provider } from "@auth0/auth0-react";
import { MantineProvider } from "@mantine/core";

import AboutUs from "./pages/customer/AboutUs.js";
import Partners from "./pages/customer/Partners.js";
import Home from "./pages/customer/Home.js";
import CustomerMenu from "./pages/customer/Menu.js";

import Orders from "./pages/portal/Orders.js";
import EditMenu from "./pages/portal/Menu.js";
import Portal from "./pages/portal/Portal.js";

// @ts-expect-error ignore type error
import "@fontsource/bangers";
// @ts-expect-error ignore type error
import "@fontsource/poppins";

import "@mantine/core/styles.css";
import "./global.css";
import Stats from "./pages/portal/Stats.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
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
              <Route index element={<Portal />} />
              <Route path="orders" element={<Orders />} />
              <Route path="menu" element={<EditMenu />} />
              <Route path="stats" element={<Stats />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Auth0Provider>
    </MantineProvider>
  </StrictMode>,
);
