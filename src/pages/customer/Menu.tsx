import { useState } from "react";
import { Accordion, Button, Flex, Stack, Text } from "@mantine/core";

import CartModal from "../../components/customer/CartModal";
import MenuItemModal from "../../components/customer/MenuItemModal";

import { menu } from "../../helpers/menu";
import { store } from "../../helpers/store";

import type { MenuItemType } from "../../helpers/menu";
import type { Cart, OrderItem } from "../../helpers/cart";

import MenuItemButton from "../../components/customer/MenuItemButton";
import PageLayout from "./PageLayout";

function Menu() {
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
          w="100%"
          pos="fixed"
          bottom="18px"
          variant="contained"
          onClick={() => setIsCartModalOpen(true)}
        >
          <Flex miw="39vw" justify="space-between">
            <Text>Review Order</Text>
            <Text>${order.total.toFixed(2)}</Text>
          </Flex>
        </Button>
      )}

      <Stack w="100%">
        <Accordion
          styles={{
            control: {
              backgroundColor: "cornsilk",
            },
          }}
        >
          {recentlyOrderedItems && (
            <Accordion.Item key="recently-ordered" value="recently-ordered">
              <Accordion.Control>
                <Text component="span">RECENTLY ORDERED</Text>
              </Accordion.Control>
              <Accordion.Panel>
                {recentlyOrderedItems.map((order) => (
                  <MenuItemButton
                    key={order.menuItem.label}
                    onClick={() => addItemToOrder(order)}
                  >
                    {order.menuItem.label} | ${order.menuItem.price}
                  </MenuItemButton>
                ))}
              </Accordion.Panel>
            </Accordion.Item>
          )}

          {menu.map((section) => (
            <Accordion.Item key={section.label} value={section.label}>
              <Accordion.Control>
                <Text component="span">{section.label.toUpperCase()}</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack>
                  {section.items.map((menuItem) => (
                    <MenuItemButton
                      key={menuItem.label}
                      onClick={() => handleOpenMenuItemModal(menuItem)}
                    >
                      {menuItem.label} | ${menuItem.price}
                    </MenuItemButton>
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
