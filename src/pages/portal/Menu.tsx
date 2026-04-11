import { useEffect } from "react";
import { Accordion, Box, Text } from "@mantine/core";
// import { withAuthenticationRequired } from "@auth0/auth0-react";

import PageLayout from "./PageLayout";
import Loading from "../../components/Loading";
import Section from "../../components/portal/menu/sections/Section";
import ManageMenu from "../../components/portal/ManageMenu";

import { fetchMenu } from "../../state/menu/menuThunks";
import { fetchModifiers } from "../../state/modifiers/modifierThunks";
import { fetchItemOptions } from "../../state/itemOptions/itemOptionThunks";

import { selectMenu, selectMenuStatus } from "../../state/menu/menuSlice";
import { selectModifiersStatus } from "../../state/modifiers/modifiersSlice";
import { selectItemOptionsStatus } from "../../state/itemOptions/itemOptionsSlice";

import { useAppDispatch, useAppSelector } from "../../state/hooks";

function Menu() {
  const dispatch = useAppDispatch();
  const menu = useAppSelector(selectMenu);
  const menuStatus = useAppSelector(selectMenuStatus);
  const modifiersStatus = useAppSelector(selectModifiersStatus);
  const itemOptionsStatus = useAppSelector(selectItemOptionsStatus);

  const isLoading =
    menuStatus === "pending" ||
    modifiersStatus === "pending" ||
    itemOptionsStatus === "pending";

  useEffect(() => {
    if (menuStatus === "idle") {
      dispatch(fetchMenu());
    }
    if (modifiersStatus === "idle") {
      dispatch(fetchModifiers());
    }
    if (itemOptionsStatus === "idle") {
      dispatch(fetchItemOptions());
    }
  }, [dispatch, menuStatus, modifiersStatus, itemOptionsStatus]);

  if (isLoading) return <Loading message="Loading store data" />;

  return (
    <PageLayout navComponents={<ManageMenu />}>
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
    </PageLayout>
  );
}

export default Menu;

// const ProtectedPortal = withAuthenticationRequired(Menu);

// export default ProtectedPortal;
