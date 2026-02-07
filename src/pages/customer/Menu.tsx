import { useState } from "react";
import { em, Box, Text, Stack, Divider, Accordion } from "@mantine/core";

import CartModal from "../../components/customer/CartModal";
import MenuItemModal from "../../components/customer/MenuItemModal";

import { menu } from "../../helpers/menu";
import { store } from "../../helpers/store";

import type { MenuItemType } from "../../helpers/menu";
import {
  calculateOrderItemPrice,
  type Cart,
  type OrderItem,
} from "../../helpers/cart";

import MenuItemButton from "../../components/customer/MenuItemButton";
import PageLayout from "./PageLayout";
import { useMediaQuery } from "@mantine/hooks";
import ButtonWithPrice from "../../components/customer/ButtonWithPrice";

function Menu() {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(
    null,
  );
  const [order, setOrder] = useState<Cart | null>(null);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const recentlyOrderedItems: OrderItem[] | null = [
    {
      menuItem: { label: "Latte", price: 5 },
      modifiers: [{ id: "1", label: "Make it a large", price: 1.5 }],
    },
  ];

  const handleOpenMenuItemModal = (menuItem: MenuItemType) => {
    setSelectedMenuItem(menuItem);
    setIsMenuItemModalOpen(true);
  };

  const addItemToOrder = (item: OrderItem) => {
    const orderItemPrice = calculateOrderItemPrice(
      item.menuItem,
      item.modifiers,
    );

    setOrder((prevOrder) => ({
      items: prevOrder ? [...prevOrder.items, item] : [item],
      total: prevOrder ? prevOrder.total + orderItemPrice : orderItemPrice,
      pickUpTimeFromNow: store.currentOrderTime.short,
    }));

    setIsMenuItemModalOpen(false);
  };

  return (
    <PageLayout>
      {order && !isCartModalOpen && (
        <Box
          w="100%"
          pos="fixed"
          px={isMobile ? "sm" : "lg"}
          bottom={isMobile ? "20px" : "11px"}
          style={{ zIndex: 9999 }}
        >
          <ButtonWithPrice
            onClick={() => setIsCartModalOpen(true)}
            label={`Review Order ${order.items && `( ${order.items.length} )`}`}
            price={order.total}
            variant="outline"
          />
        </Box>
      )}

      <Stack w="100%">
        <Accordion
          styles={{
            item: { borderColor: "darkslategray" },
            content: {
              padding: 0,
              margin: 0,
              backgroundColor: "white",
            },
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
                        key={order.menuItem.label}
                        onClick={() => addItemToOrder(order)}
                        {...order}
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
