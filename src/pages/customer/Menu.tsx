import { useState } from "react";
import { Accordion, Button, Divider, em, Stack, Text } from "@mantine/core";

import CartModal from "../../components/customer/CartModal";
import MenuItemModal from "../../components/customer/MenuItemModal";

import { menu } from "../../helpers/menu";
import { store } from "../../helpers/store";

import type { MenuItemType } from "../../helpers/menu";
import type { Cart, OrderItem } from "../../helpers/cart";

import MenuItemButton from "../../components/customer/MenuItemButton";
import PageLayout from "./PageLayout";
import { useMediaQuery } from "@mantine/hooks";

function Menu() {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(
    null,
  );
  const [order, setOrder] = useState<Cart | null>(null);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const recentlyOrderedItems: OrderItem[] | null = [
    { menuItem: { label: "Latte", price: 5 }, totalPrice: 5 },
  ];

  const handleOpenMenuItemModal = (menuItem: MenuItemType) => {
    setSelectedMenuItem(menuItem);
    setIsMenuItemModalOpen(true);
  };

  const addItemToOrder = (item: OrderItem) => {
    setOrder((prevOrder) =>
      prevOrder
        ? {
            ...prevOrder,
            items: [...prevOrder.items, item],
            total: prevOrder.total + item.totalPrice,
          }
        : {
            items: [item],
            total: item.totalPrice,
            pickUpTimeFromNow: store.currentOrderTime.short,
          },
    );
    setIsMenuItemModalOpen(false);
  };

  return (
    <PageLayout>
      {order && (
        <Button
          pos="fixed"
          color="red.9"
          variant="filled"
          w="fit-content"
          px={isMobile ? "sm" : "lg"}
          size={isMobile ? "sm" : "xl"}
          bottom={isMobile ? "20px" : "11px"}
          onClick={() => setIsCartModalOpen(true)}
          rightSection={<Text>${order.total.toFixed(2)}</Text>}
        >
          Review Order
        </Button>
      )}

      <Stack w="100%">
        <Accordion
          styles={{
            item: { borderColor: "darkslategray" },
            content: { padding: 0, margin: 0, backgroundColor: "white" },
            control: {
              backgroundColor: "whitesmoke",
            },
          }}
        >
          {recentlyOrderedItems && (
            <Accordion.Item key="recently-ordered" value="recently-ordered">
              <Accordion.Control>
                <Text component="span">RECENTLY ORDERED</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="3">
                  {recentlyOrderedItems.map((order, index) => (
                    <>
                      {index !== 0 && <Divider />}
                      <MenuItemButton
                        menuItem={order.menuItem}
                        key={order.menuItem.label}
                        onClick={() => addItemToOrder(order)}
                      />
                    </>
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          )}

          {menu.map((section) => (
            <Accordion.Item key={section.label} value={section.label}>
              <Accordion.Control>
                <Text component="span">{section.label.toUpperCase()}</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="0">
                  {section.items.map((menuItem, index) => (
                    <>
                      {index !== 0 && <Divider />}
                      <MenuItemButton
                        key={menuItem.label}
                        menuItem={menuItem}
                        onClick={() => handleOpenMenuItemModal(menuItem)}
                      />
                    </>
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Stack>

      {selectedMenuItem && (
        <MenuItemModal
          isOpen={isMenuItemModalOpen}
          onClose={() => setIsMenuItemModalOpen(false)}
          menuItem={selectedMenuItem}
          onAddToOrder={addItemToOrder}
        />
      )}

      {order && (
        <CartModal
          order={order}
          isOpen={isCartModalOpen}
          onClose={() => setIsCartModalOpen(false)}
        />
      )}
    </PageLayout>
  );
}

export default Menu;
