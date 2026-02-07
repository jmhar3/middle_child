import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { Auth0Provider } from "@auth0/auth0-react";
import { MantineProvider } from "@mantine/core";

import AboutUs from "./pages/customer/AboutUs.js";
import Partners from "./pages/customer/Partners.js";
import Home from "./pages/customer/Home.js";

// @ts-expect-error ignore type error
import "@fontsource/bangers";
// @ts-expect-error ignore type error
import "@fontsource/poppins";

import "@mantine/core/styles.css";
import "./global.css";
import CustomerMenu from "./pages/customer/Menu.js";
import Orders from "./pages/portal/Orders.js";
import EditMenu from "./pages/portal/EditMenu.js";

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
            {/* Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/about-us/ai" element={<AboutUs />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/menu" element={<CustomerMenu />} />
            {/* Private Portal */}
            <Route path="/orders" element={<Orders />} />
            <Route path="/edit-menu" element={<EditMenu />} />
          </Routes>
        </BrowserRouter>
      </Auth0Provider>
    </MantineProvider>
  </StrictMode>,
);
