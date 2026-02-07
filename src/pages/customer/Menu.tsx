import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { em, Box, Text, Stack, Divider, Accordion } from "@mantine/core";

import PageLayout from "./PageLayout";
import CartModal from "../../components/customer/CartModal";
import MenuItemModal from "../../components/customer/MenuItemModal";
import MenuItemButton from "../../components/customer/MenuItemButton";
import ButtonWithPrice from "../../components/customer/ButtonWithPrice";

import { menu } from "../../helpers/menu";
import { store } from "../../helpers/store";

import {
  calculateOrderItemPrice,
  findExistingOrderItem,
} from "../../helpers/cart";

import type { MenuItemType } from "../../helpers/menu";
import type { Cart, OrderItem } from "../../helpers/cart";

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
      quantity: 1,
      menuItem: { label: "Latte", price: 5 },
      modifiers: [{ id: "1", label: "Make it a large", price: 1.5 }],
    },
  ];

  const handleOpenMenuItemModal = (menuItem: MenuItemType) => {
    setSelectedMenuItem(menuItem);
    setIsMenuItemModalOpen(true);
  };

  const addItemToOrder = (item: OrderItem) => {
    const orderItemPrice =
      calculateOrderItemPrice(item.menuItem, item.modifiers) * item.quantity;

    setOrder((prevOrder) => {
      if (prevOrder) {
        const existingOrderItem = findExistingOrderItem(prevOrder.items, item);

        return {
          // if matching order item exists, update quantity
          items: existingOrderItem
            ? [
                ...prevOrder.items,
                {
                  ...existingOrderItem,
                  quantity: existingOrderItem.quantity + item.quantity,
                },
              ]
            : [...prevOrder.items, item],
          total: prevOrder.total + orderItemPrice,
          pickUpTimeFromNow: store.currentOrderTime.short,
        };
      } else {
        return {
          items: [item],
          total: orderItemPrice,
          pickUpTimeFromNow: store.currentOrderTime.short,
        };
      }
    });

    setIsMenuItemModalOpen(false);
  };

  const onEditOrderItem = (
    oldOrderItem: OrderItem,
    newOrderItem: OrderItem,
  ) => {
    const oldOrderItemPrice =
      calculateOrderItemPrice(oldOrderItem.menuItem, oldOrderItem.modifiers) *
      oldOrderItem.quantity;

    const newOrderItemPrice =
      calculateOrderItemPrice(newOrderItem.menuItem, newOrderItem.modifiers) *
      newOrderItem.quantity;

    setOrder((prevOrder) => {
      if (prevOrder) {
        const filteredPrevOrderItems = prevOrder.items.filter(
          (item) => item === oldOrderItem,
        );

        return {
          items: [...filteredPrevOrderItems, newOrderItem],
          total: prevOrder.total - oldOrderItemPrice + newOrderItemPrice,
          pickUpTimeFromNow: store.currentOrderTime.short,
        };
      } else {
        return null;
      }
    });

    setIsMenuItemModalOpen(false);
  };

  const onDeleteOrderItem = (orderItem: OrderItem) => {
    const orderItemPrice =
      calculateOrderItemPrice(orderItem.menuItem, orderItem.modifiers) *
      orderItem.quantity;

    setOrder(
      (prevOrder) =>
        prevOrder && {
          items: prevOrder.items.filter((item) => orderItem === item),
          total: orderItemPrice - orderItemPrice,
          pickUpTimeFromNow: store.currentOrderTime.short,
        },
    );
  };

  return (
    <PageLayout>
      {order && !isCartModalOpen && !isMenuItemModalOpen && (
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
          onEditOrderItem={onEditOrderItem}
          onDeleteOrderItem={onDeleteOrderItem}
        />
      )}
    </PageLayout>
  );
}

export default Menu;
