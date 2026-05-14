import { useEffect, useMemo, useState } from "react";
import { em, Box, Text, Stack, Divider, Accordion } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { v4 as uuid } from "uuid";

import banner from "/assets/cafe-counter.jpeg";

import PageLayout from "./PageLayout";
import Loading from "../../components/Loading";
import CartModal from "../../components/customer/CartModal";
import MenuItemModal from "../../components/MenuItemModal";
import MenuItemButton from "../../components/customer/MenuItemButton";
import ButtonWithPrice from "../../components/customer/ButtonWithPrice";

import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { fetchMenu } from "../../state/menu/menuThunks";
import { fetchStoreInfo } from "../../state/storeInfo/storeInfoThunks";
import { selectMenu, selectMenuStatus } from "../../state/menu/menuSlice";

import {
  selectStoreInfo,
  selectStoreInfoStatus,
  selectStoreIsOpen,
} from "../../state/storeInfo/storeInfoSlice";

import {
  calculateOrderItemPrice,
  checkIsAuthenticated,
  filterItemFromOrder,
  findExistingOrderItem,
} from "../../helpers";

import type { MenuItemType, Cart, OrderItem } from "../../state/types";

function Menu() {
  const dispatch = useAppDispatch();
  const menuStatus = useAppSelector(selectMenuStatus);
  const menu = useAppSelector(selectMenu);
  const storeInfoStatus = useAppSelector(selectStoreInfoStatus);
  const storeInfo = useAppSelector(selectStoreInfo);
  const storeIsOpen = useAppSelector(selectStoreIsOpen);

  const isLoading = menuStatus === "pending" || storeInfoStatus === "pending";

  const isAuthenticated = checkIsAuthenticated();

  useEffect(() => {
    if (menuStatus === "idle") {
      dispatch(fetchMenu());
    }
    if (storeInfoStatus === "idle") {
      dispatch(fetchStoreInfo());
    }
  }, [dispatch, menuStatus, storeInfoStatus]);

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(
    null,
  );
  const [order, setOrder] = useState<Cart | null>(null);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const recentlyOrderedItems: OrderItem[] | null =
    menu.length > 0
      ? [
          {
            id: "1",
            quantity: 1,
            item: menu[0]?.items[0],
            modifiers: [],
          },
        ]
      : null;

  const totalItemsInOrder = useMemo(
    () =>
      order?.items.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.quantity;
      }, 0),
    [order],
  );

  const calculatePickUpTimeFromNow = (items: OrderItem[]) => {
    const hasLongPrepTime = items.find(
      (orderItem) => orderItem.item.has_long_prep_time || false,
    );
    if (hasLongPrepTime || items.length > 5) {
      return storeInfo.current_order_time.long;
    } else {
      return storeInfo.current_order_time.short;
    }
  };

  const handleOpenMenuItemModal = (menuItem: MenuItemType) => {
    setSelectedMenuItem(menuItem);
    setIsMenuItemModalOpen(true);
  };

  const addItemToOrder = (item: OrderItem) => {
    const orderItemPrice =
      calculateOrderItemPrice(item.item, item.modifiers) * item.quantity;

    setOrder((cart) => {
      if (cart) {
        const existingOrderItem = findExistingOrderItem(cart.items, item);

        const filteredOrderItems =
          existingOrderItem &&
          filterItemFromOrder(cart.items, existingOrderItem);

        if (existingOrderItem && filteredOrderItems) {
          const newOrderItems = [
            ...filteredOrderItems,
            {
              ...existingOrderItem,
              quantity: existingOrderItem.quantity + item.quantity,
            },
          ];

          return {
            // if matching item exists in order, return filtered order + update quantity on item
            items:
              existingOrderItem && filteredOrderItems
                ? newOrderItems
                : [...cart.items, item],
            total: cart.total + orderItemPrice,
            pickUpTimeFromNow: calculatePickUpTimeFromNow(newOrderItems),
          };
        }

        return {
          items: [item],
          total: orderItemPrice,
          pickUpTimeFromNow: calculatePickUpTimeFromNow([item]),
        };
      }

      return {
        items: [item],
        total: orderItemPrice,
        pickUpTimeFromNow: calculatePickUpTimeFromNow([item]),
      };
    });

    setIsMenuItemModalOpen(false);
  };

  const onEditOrderItem = (
    oldOrderItem: OrderItem,
    newOrderItem: OrderItem,
  ) => {
    const oldOrderItemPrice =
      calculateOrderItemPrice(oldOrderItem.item, oldOrderItem.modifiers) *
      oldOrderItem.quantity;

    const newOrderItemPrice =
      calculateOrderItemPrice(newOrderItem.item, newOrderItem.modifiers) *
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
          pickUpTimeFromNow: calculatePickUpTimeFromNow([
            ...filteredOrderItems,
            newOrderItem,
          ]),
        };
      } else {
        return null;
      }
    });

    setIsMenuItemModalOpen(false);
  };

  const onDeleteOrderItem = (orderItem: OrderItem) => {
    const orderItemPrice =
      calculateOrderItemPrice(orderItem.item, orderItem.modifiers) *
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
          pickUpTimeFromNow: calculatePickUpTimeFromNow(filteredOrderItems),
        };
      }
      return null;
    });
  };

  const onMenuItemClick = (menuItem: MenuItemType) => {
    if (
      menuItem.description ||
      menuItem.image ||
      menuItem.modifiers ||
      menuItem.modifierCategories
    ) {
      handleOpenMenuItemModal(menuItem);
    } else {
      addItemToOrder({
        id: uuid(),
        quantity: 1,
        item: menuItem,
        modifiers: [],
      });
    }
  };

  if (isLoading) return <Loading message="Loading store data" />;

  return (
    <PageLayout image={banner}>
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
            />
          </Box>
        )}

      <Stack w="100%" p="xs" gap="0" align="center">
        {storeIsOpen ? (
          <>
            <Text>
              We're currently {storeInfo.current_order_time.label.toLowerCase()}
            </Text>
            <Text pb="xs">
              Pick up time from {storeInfo.current_order_time.short} minutes
            </Text>

            {isAuthenticated && (
              <>
                <Divider w="100%" />

                <Text pt="xs">You're 2 coffees away from a freebie!</Text>
              </>
            )}
          </>
        ) : (
          <>
            <Text>Sorry, we're closed.</Text>
            <Text>Our brewing hours are:</Text>
            <Text>Mon - Fri 7:30am - 1pm</Text>
            <Text>Sat - Sun 7:30am - 2pm</Text>
          </>
        )}
      </Stack>

      <Divider w="100%" />

      <Stack w="100%" pb="60">
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
                  {recentlyOrderedItems.map((orderItem, index) => (
                    <>
                      {index !== 0 && <Divider />}
                      <MenuItemButton
                        key={orderItem.item.label}
                        onClick={() => addItemToOrder(orderItem)}
                        {...orderItem}
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
                        item={menuItem}
                        onClick={() => onMenuItemClick(menuItem)}
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
