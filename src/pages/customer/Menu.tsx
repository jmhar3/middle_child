import { useMemo, useState } from "react";
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
  filterItemFromOrder,
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
      menuItem: {
        id: "1",
        price: 5,
        label: "Latte",
        isLoyaltyApplicable: true,
      },
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

        const filteredOrderItems =
          existingOrderItem &&
          filterItemFromOrder(prevOrder.items, existingOrderItem);

        return {
          // if matching item exists in order, return filtered order + update quantity on item
          items:
            existingOrderItem && filteredOrderItems
              ? [
                  ...filteredOrderItems,
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
        const filteredOrderItems = filterItemFromOrder(
          prevOrder.items,
          oldOrderItem,
        );

        return {
          items: [...filteredOrderItems, newOrderItem],
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

    setOrder((prevOrder) => {
      if (prevOrder) {
        const filteredOrderItems = filterItemFromOrder(
          prevOrder.items,
          orderItem,
        );
        if (filteredOrderItems.length === 0) setIsCartModalOpen(false);
        return {
          items: filteredOrderItems,
          total: prevOrder.total - orderItemPrice,
          pickUpTimeFromNow: store.currentOrderTime.short,
        };
      }
      return null;
    });
  };

  const totalItemsInOrder = useMemo(
    () =>
      order?.items.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.quantity;
      }, 0),
    [order],
  );

  return (
    <PageLayout>
      {order &&
        order.items.length > 0 &&
        !isCartModalOpen &&
        !isMenuItemModalOpen && (
          <Box
            w="100%"
            pos="fixed"
            px={isMobile ? "sm" : "lg"}
            bottom={isMobile ? "20px" : "11px"}
            style={{ zIndex: 9999 }}
          >
            <ButtonWithPrice
              onClick={() => setIsCartModalOpen(true)}
              label={`Review Order ${order.items && `( ${totalItemsInOrder} )`}`}
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
          onClose={() => {
            setSelectedMenuItem(null);
            setIsMenuItemModalOpen(false);
          }}
          menuItem={selectedMenuItem}
          onAddToOrder={addItemToOrder}
        />
      )}

      {order && order.items.length > 0 && (
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
