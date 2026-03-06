import dayjs from "dayjs";

import { menu } from "./menu";

import type { MenuItemType, Modifier } from "./menu";

export interface User {
  id: string;
  name: string;
  loyaltyPoints?: number;
}

export interface OrderItem {
  id: string;
  menuItem: MenuItemType;
  modifiers: Modifier[];
  quantity: number;
  note?: string;
}

export interface Cart {
  items: OrderItem[];
  total: number;
  pickUpTimeFromNow: number;
  notes?: string;
}

export interface OrderType {
  id: string;
  user: User;
  dueAt: dayjs.Dayjs;
  total: number;
  notes?: string;
  items: OrderItem[];
  isComplete: boolean;
  cancellationMessage?: string;
}

export const mockOrders: OrderType[] = [
  {
    id: "1",
    user: { id: "1", name: "Jess", loyaltyPoints: 3 },
    dueAt: dayjs().subtract(2, "minutes"),
    total: 15,
    notes: "Chuck em in a carry tray pls",
    items: [
      {
        id: "1",
        menuItem: menu[0].items[0],
        modifiers: [{ id: "2", label: "BYO Keep Cup", color: "darkgreen" }],
        quantity: 2,
        note: "Extra honey pls :)",
      },
      {
        id: "2",
        menuItem: menu[0].items[2],
        modifiers: [],
        quantity: 1,
      },
      {
        id: "3",
        menuItem: menu[0].items[4],
        modifiers: [],
        quantity: 1,
      },
    ],
    isComplete: false,
  },
  {
    id: "2",
    user: { id: "2", name: "Noah", loyaltyPoints: 5 },
    dueAt: dayjs().add(6, "minutes"),
    total: 6.5,
    items: [
      {
        id: "4",
        menuItem: menu[0].items[2],
        modifiers: [{ id: "6", label: "Strong", price: 1, color: "dark" }],
        quantity: 1,
      },
      {
        id: "5",
        menuItem: menu[0].items[5],
        modifiers: [],
        quantity: 1,
      },
    ],
    isComplete: false,
  },
  {
    id: "3",
    user: { id: "3", name: "Sam", loyaltyPoints: 4 },
    dueAt: dayjs().add(9, "minutes"),
    total: 12,
    items: [
      {
        id: "6",
        menuItem: menu[0].items[3],
        modifiers: [
          { id: "2", label: "BYO Keep Cup", color: "darkgreen" },
          { id: "6", label: "Strong", price: 1, color: "dark" },
        ],
        quantity: 1,
      },
      {
        id: "7",
        menuItem: menu[1].items[1],
        modifiers: [{ id: "6", label: "Strong", price: 1, color: "dark" }],
        quantity: 1,
      },
    ],
    isComplete: false,
  },
];
