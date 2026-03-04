import { notifications } from "@mantine/notifications";
import { supabase } from "./supabase";

export interface Modifier {
  id: string;
  label: string;
  price?: number;
  is_in_stock?: boolean;
  is_ingredient?: boolean;
  color?: string;
}

export interface ItemOptions {
  id: string;
  label: string;
  allowMultipleSelections: boolean;
  modifiers: Modifier[];
}

export interface MenuItemType {
  id: string;
  label: string;
  price: number;
  image?: string;
  is_in_stock?: boolean;
  ingredients?: Modifier[];
  hasLongPrepTime?: boolean;
  isLoyaltyApplicable?: boolean;
  modifiers?: Modifier[];
  modifierCategories?: ItemOptions[];
}

export interface MenuSection {
  id: string;
  label: string;
  items: MenuItemType[];
}

export const menu: MenuSection[] = [
  {
    id: "1",
    label: "Coffee / Drinks",
    items: [
      {
        id: "1",
        label: "Latte",
        price: 5,
        isLoyaltyApplicable: true,
        modifiers: [
          { id: "1", label: "Make it a large", price: 1.5 },
          { id: "2", label: "BYO Keep Cup" },
          { id: "7", label: "3/4 Full" },
        ],
        modifierCategories: [
          {
            id: "1",
            label: "Temperature",
            allowMultipleSelections: false,
            modifiers: [
              { id: "3", label: "With Ice" },
              { id: "4", label: "Extra Hot" },
            ],
          },
          {
            id: "2",
            label: "Strength",
            allowMultipleSelections: false,
            modifiers: [
              { id: "5", label: "Weak" },
              { id: "6", label: "Strong", price: 1 },
              { id: "8", label: "Decaf", is_ingredient: true },
            ],
          },
          {
            id: "3",
            label: "Milk",
            allowMultipleSelections: false,
            modifiers: [
              { id: "9", label: "Full Cream", is_ingredient: true },
              { id: "10", label: "Skinny", is_ingredient: true },
              { id: "11", label: "Lactose Free", is_ingredient: true },
              { id: "12", label: "Soy", is_ingredient: true, color: "red" },
              { id: "13", label: "Oat", is_ingredient: true },
              {
                id: "14",
                label: "Almond",
                is_ingredient: true,
                color: "green",
              },
            ],
          },
          {
            id: "4",
            label: "Sugar / Sweetener",
            allowMultipleSelections: false,
            modifiers: [
              { id: "16", label: "1/2 Sugar" },
              { id: "17", label: "1 Sugar" },
              { id: "18", label: "2 Sugars" },
              { id: "19", label: "3 Sugars" },
              { id: "21", label: "1/2 Equal" },
              { id: "22", label: "1 Equal" },
              { id: "23", label: "2 Equals" },
              { id: "26", label: "Honey" },
            ],
          },
        ],
      },
      {
        id: "2",
        label: "Flat White",
        price: 5,
        isLoyaltyApplicable: true,
        modifiers: [
          { id: "1", label: "Make it a large", price: 1.5 },
          { id: "2", label: "BYO Keep Cup" },
          { id: "7", label: "3/4 Full" },
        ],
        modifierCategories: [
          {
            id: "1",
            label: "Temperature",
            allowMultipleSelections: false,
            modifiers: [
              { id: "3", label: "With Ice" },
              { id: "4", label: "Extra Hot" },
            ],
          },
          {
            id: "2",
            label: "Strength",
            allowMultipleSelections: false,
            modifiers: [
              { id: "5", label: "Weak" },
              { id: "6", label: "Strong", price: 1 },
              { id: "8", label: "Decaf", is_ingredient: true },
            ],
          },
          {
            id: "3",
            label: "Milk",
            allowMultipleSelections: false,
            modifiers: [
              { id: "9", label: "Full Cream", is_ingredient: true },
              { id: "10", label: "Skinny", is_ingredient: true },
              { id: "11", label: "Lactose Free", is_ingredient: true },
              { id: "12", label: "Soy", is_ingredient: true },
              { id: "13", label: "Oat", is_ingredient: true },
              { id: "14", label: "Almond", is_ingredient: true },
            ],
          },
          {
            id: "4",
            label: "Sugar / Sweetener",
            allowMultipleSelections: false,
            modifiers: [
              { id: "16", label: "1/2 Sugar" },
              { id: "17", label: "1 Sugar" },
              { id: "18", label: "2 Sugars" },
              { id: "19", label: "3 Sugars" },
              { id: "21", label: "1/2 Equal" },
              { id: "22", label: "1 Equal" },
              { id: "23", label: "2 Equals" },
              { id: "26", label: "Honey" },
            ],
          },
        ],
      },
      {
        id: "3",
        label: "Cappuccino",
        price: 5,
        isLoyaltyApplicable: true,
        modifiers: [
          { id: "1", label: "Make it a large", price: 1.5 },
          { id: "2", label: "BYO Keep Cup" },
          { id: "7", label: "3/4 Full" },
        ],
        modifierCategories: [
          {
            id: "1",
            label: "Temperature",
            allowMultipleSelections: false,
            modifiers: [
              { id: "3", label: "With Ice" },
              { id: "4", label: "Extra Hot" },
            ],
          },
          {
            id: "2",
            label: "Strength",
            allowMultipleSelections: false,
            modifiers: [
              { id: "5", label: "Weak" },
              { id: "6", label: "Strong", price: 1 },
              { id: "8", label: "Decaf", is_ingredient: true },
            ],
          },
          {
            id: "3",
            label: "Milk",
            allowMultipleSelections: false,
            modifiers: [
              { id: "9", label: "Full Cream", is_ingredient: true },
              { id: "10", label: "Skinny", is_ingredient: true },
              { id: "11", label: "Lactose Free", is_ingredient: true },
              { id: "12", label: "Soy", is_ingredient: true },
              { id: "13", label: "Oat", is_ingredient: true },
              { id: "14", label: "Almond", is_ingredient: true },
            ],
          },
          {
            id: "4",
            label: "Sugar / Sweetener",
            allowMultipleSelections: false,
            modifiers: [
              { id: "16", label: "1/2 Sugar" },
              { id: "17", label: "1 Sugar" },
              { id: "18", label: "2 Sugars" },
              { id: "19", label: "3 Sugars" },
              { id: "21", label: "1/2 Equal" },
              { id: "22", label: "1 Equal" },
              { id: "23", label: "2 Equals" },
              { id: "26", label: "Honey" },
            ],
          },
        ],
      },
      {
        id: "4",
        label: "Espresso",
        price: 5,
        isLoyaltyApplicable: true,
        modifiers: [
          { id: "1", label: "Make it a large", price: 1.5 },
          { id: "2", label: "BYO Keep Cup" },
          { id: "8", label: "Decaf", is_ingredient: true },
        ],
        modifierCategories: [
          {
            id: "4",
            label: "Sugar / Sweetener",
            allowMultipleSelections: false,
            modifiers: [
              { id: "16", label: "1/2 Sugar" },
              { id: "17", label: "1 Sugar" },
              { id: "18", label: "2 Sugars" },
              { id: "19", label: "3 Sugars" },
              { id: "21", label: "1/2 Equal" },
              { id: "22", label: "1 Equal" },
              { id: "23", label: "2 Equals" },
              { id: "26", label: "Honey" },
            ],
          },
        ],
      },
      {
        id: "5",
        label: "Long Black",
        price: 5,
        isLoyaltyApplicable: true,
        modifiers: [
          { id: "1", label: "Make it a large", price: 1.5 },
          { id: "2", label: "BYO Keep Cup" },
          { id: "3", label: "With Ice" },
          { id: "5", label: "Weak" },
          { id: "6", label: "Strong", price: 1 },
          { id: "7", label: "3/4 Full" },
          { id: "8", label: "Decaf", is_ingredient: true },
        ],
        modifierCategories: [
          {
            id: "4",
            label: "Sugar / Sweetener",
            allowMultipleSelections: false,
            modifiers: [
              { id: "16", label: "1/2 Sugar" },
              { id: "17", label: "1 Sugar" },
              { id: "18", label: "2 Sugars" },
              { id: "19", label: "3 Sugars" },
              { id: "21", label: "1/2 Equal" },
              { id: "22", label: "1 Equal" },
              { id: "23", label: "2 Equals" },
              { id: "26", label: "Honey" },
            ],
          },
        ],
      },
      {
        id: "6",
        label: "Hot Chocolate",
        price: 5,
        modifiers: [
          { id: "1", label: "Make it a large", price: 1.5 },
          { id: "2", label: "BYO Keep Cup" },
          { id: "4", label: "Extra Hot" },
          { id: "7", label: "3/4 Full" },
        ],
        modifierCategories: [
          {
            id: "3",
            label: "Milk",
            allowMultipleSelections: false,
            modifiers: [
              { id: "9", label: "Full Cream", is_ingredient: true },
              { id: "10", label: "Skinny", is_ingredient: true },
              { id: "11", label: "Lactose Free", is_ingredient: true },
              { id: "12", label: "Soy", is_ingredient: true },
              { id: "13", label: "Oat", is_ingredient: true },
              { id: "14", label: "Almond", is_ingredient: true },
            ],
          },
          {
            id: "4",
            label: "Sugar / Sweetener",
            allowMultipleSelections: false,
            modifiers: [
              { id: "16", label: "1/2 Sugar" },
              { id: "17", label: "1 Sugar" },
              { id: "18", label: "2 Sugars" },
              { id: "19", label: "3 Sugars" },
              { id: "21", label: "1/2 Equal" },
              { id: "22", label: "1 Equal" },
              { id: "23", label: "2 Equals" },
              { id: "26", label: "Honey" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    label: "Milkshakes / Smoothies",
    items: [
      {
        id: "7",
        label: "Milkshake",
        price: 5,
        modifiers: [{ id: "1", label: "Make it a large", price: 1.5 }],
        modifierCategories: [
          {
            id: "4",
            label: "Milk",
            allowMultipleSelections: false,
            modifiers: [
              { id: "9", label: "Full Cream", is_ingredient: true },
              { id: "10", label: "Skinny", is_ingredient: true },
              { id: "11", label: "Lactose Free", is_ingredient: true },
              { id: "12", label: "Soy", is_ingredient: true },
              { id: "13", label: "Oat", is_ingredient: true },
              { id: "14", label: "Almond", is_ingredient: true },
            ],
          },
          {
            id: "5",
            label: "Flavours",
            allowMultipleSelections: true,
            modifiers: [
              { id: "27", label: "Strawberry", is_ingredient: true },
              { id: "28", label: "Banana", is_ingredient: true },
              { id: "29", label: "Chocolate", is_ingredient: true },
              { id: "30", label: "Cookies", is_ingredient: true },
              { id: "31", label: "Vanilla", is_ingredient: true },
              { id: "32", label: "Caramel", is_ingredient: true },
              { id: "33", label: "Mocha", is_ingredient: true, price: 2.5 },
            ],
          },
        ],
      },
      {
        id: "8",
        label: "Jewel Smoothie",
        price: 5,
        ingredients: [
          { id: "34", label: "Almond Milk", is_ingredient: true },
          { id: "35", label: "Banana", is_ingredient: true },
          { id: "36", label: "Berries", is_ingredient: true },
          { id: "37", label: "Agave", is_ingredient: true },
        ],
      },
      {
        id: "9",
        label: "Daisy Smoothie",
        price: 5,
        ingredients: [
          { id: "38", label: "Coconut Water", is_ingredient: true },
          { id: "39", label: "Cucumber", is_ingredient: true },
          { id: "40", label: "Kiwi", is_ingredient: true },
          { id: "41", label: "Spinach", is_ingredient: true },
          { id: "42", label: "Mango", is_ingredient: true },
          { id: "43", label: "Parsley", is_ingredient: true },
          { id: "44", label: "Lemon", is_ingredient: true },
        ],
      },
    ],
  },
  {
    id: "3",
    label: "Pastries",
    items: [
      {
        id: "10",
        label: "Croissant",
        price: 5,
        is_in_stock: true,
        modifiers: [{ id: "45", label: "Warmed up" }],
      },
      {
        id: "11",
        label: "Almond Croissant",
        price: 5,
        is_in_stock: true,
        modifiers: [{ id: "45", label: "Warmed up" }],
      },
      {
        id: "12",
        label: "Hazelnut Cruffin",
        price: 5,
        is_in_stock: true,
        modifiers: [{ id: "45", label: "Warmed up" }],
      },
    ],
  },
  {
    id: "4",
    label: "Brunch",
    items: [
      {
        id: "13",
        price: 5,
        label: "Bacon & Egg Roll",
        hasLongPrepTime: true,
        image:
          "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepCZ8V_FAiAumjIZC805KGY74ETVdk1E4UlVkASH86p-Ob3TakPO-yHTctdwoRDJvC6QoaAItNlxC57fk3cSTnA6TfasIfsn_7wezM7Otg8bdY9D_QkhZeiAmIMiDkwp5Vwttg=s1360-w1360-h1020-rw",
        ingredients: [
          { id: "46", label: "Bacon", is_ingredient: true },
          { id: "47", label: "Egg", is_ingredient: true },
          { id: "48", label: "Cheese", is_ingredient: true },
          { id: "49", label: "Spinach", is_ingredient: true },
        ],
        modifierCategories: [
          {
            id: "6",
            label: "Add Ons",
            allowMultipleSelections: false,
            modifiers: [
              { id: "48", label: "Cheese", is_ingredient: true },
              { id: "49", label: "Sourdough", is_ingredient: true },
            ],
          },
          {
            id: "7",
            label: "Remove",
            allowMultipleSelections: false,
            modifiers: [
              { id: "46", label: "Bacon", is_ingredient: true },
              { id: "47", label: "Egg", is_ingredient: true },
              { id: "48", label: "Cheese", is_ingredient: true },
              { id: "49", label: "Spinach", is_ingredient: true },
            ],
          },
        ],
      },
    ],
  },
];

export const ingredients: Modifier[] = [
  { id: "9", label: "Full Cream", is_ingredient: true },
  { id: "10", label: "Skinny", is_ingredient: true },
  { id: "11", label: "Lactose Free", is_ingredient: true },
  { id: "12", label: "Soy", is_ingredient: true },
  { id: "13", label: "Oat", is_ingredient: true },
  { id: "14", label: "Almond", is_ingredient: true },
  { id: "27", label: "Strawberry", is_ingredient: true },
  { id: "28", label: "Banana", is_ingredient: true },
  { id: "29", label: "Chocolate", is_ingredient: true },
  { id: "30", label: "Cookies", is_ingredient: true },
  { id: "31", label: "Vanilla", is_ingredient: true },
  { id: "32", label: "Caramel", is_ingredient: true },
  { id: "33", label: "Mocha", is_ingredient: true, price: 2.5 },
  { id: "34", label: "Almond Milk", is_ingredient: true },
  { id: "35", label: "Banana", is_ingredient: true },
  { id: "36", label: "Berries", is_ingredient: true },
  { id: "37", label: "Agave", is_ingredient: true },
  { id: "38", label: "Coconut Water", is_ingredient: true },
  { id: "39", label: "Cucumber", is_ingredient: true },
  { id: "40", label: "Kiwi", is_ingredient: true },
  { id: "41", label: "Spinach", is_ingredient: true },
  { id: "42", label: "Mango", is_ingredient: true },
  { id: "43", label: "Parsley", is_ingredient: true },
  { id: "44", label: "Lemon", is_ingredient: true },
  { id: "46", label: "Bacon", is_ingredient: true },
  { id: "47", label: "Egg", is_ingredient: true },
  { id: "48", label: "Cheese", is_ingredient: true },
  { id: "49", label: "Spinach", is_ingredient: true },
];

export const modifierCategories: ItemOptions[] = [
  {
    id: "1",
    label: "Temperature",
    allowMultipleSelections: false,
    modifiers: [
      { id: "3", label: "With Ice" },
      { id: "4", label: "Extra Hot" },
    ],
  },
  {
    id: "2",
    label: "Strength",
    allowMultipleSelections: false,
    modifiers: [
      { id: "5", label: "Weak" },
      { id: "6", label: "Strong", price: 1 },
      { id: "8", label: "Decaf", is_ingredient: true },
    ],
  },
  {
    id: "3",
    label: "Milk",
    allowMultipleSelections: false,
    modifiers: [
      { id: "9", label: "Full Cream", is_ingredient: true },
      { id: "10", label: "Skinny", is_ingredient: true },
      { id: "11", label: "Lactose Free", is_ingredient: true },
      { id: "12", label: "Soy", is_ingredient: true },
      { id: "13", label: "Oat", is_ingredient: true },
      { id: "14", label: "Almond", is_ingredient: true },
    ],
  },
  {
    id: "4",
    label: "Sugar / Sweetener",
    allowMultipleSelections: false,
    modifiers: [
      { id: "16", label: "1/2 Sugar" },
      { id: "17", label: "1 Sugar" },
      { id: "18", label: "2 Sugars" },
      { id: "19", label: "3 Sugars" },
      { id: "21", label: "1/2 Equal" },
      { id: "22", label: "1 Equal" },
      { id: "23", label: "2 Equals" },
      { id: "26", label: "Honey" },
    ],
  },
];

export const modifiers: Modifier[] = [
  { id: "1", label: "Make it a large", price: 1.5 },
  { id: "2", label: "BYO Keep Cup" },
  { id: "3", label: "With Ice" },
  { id: "4", label: "Extra Hot" },
  { id: "5", label: "Weak" },
  { id: "6", label: "Strong", price: 1 },
  { id: "7", label: "3/4 Full" },
  { id: "8", label: "Decaf", is_ingredient: true },
  { id: "9", label: "Full Cream", is_ingredient: true },
  { id: "10", label: "Skinny", is_ingredient: true },
  { id: "11", label: "Lactose Free", is_ingredient: true },
  { id: "12", label: "Soy", is_ingredient: true },
  { id: "13", label: "Oat", is_ingredient: true },
  { id: "14", label: "Almond", is_ingredient: true },
  { id: "16", label: "1/2 Sugar" },
  { id: "17", label: "1 Sugar" },
  { id: "18", label: "2 Sugars" },
  { id: "19", label: "3 Sugars" },
  { id: "21", label: "1/2 Equal" },
  { id: "22", label: "1 Equal" },
  { id: "23", label: "2 Equals" },
  { id: "26", label: "Honey" },
];

export const fetchModifiers = async () => {
  const { data, error } = await supabase
    .from("modifiers")
    .select()
    .overrideTypes<Array<Modifier>, { merge: false }>();

  if (data) return data;

  if (error) {
    notifications.show({
      withCloseButton: false,
      message: error.message,
      title: error.name,
      position: "bottom-right",
      color: "red",
    });
    console.error(error);
  }
};

export const upsertModifier = async (params: Partial<Modifier>) => {
  const { error } = await supabase.from("modifiers").upsert({
    ...params,
    price: params.price === 0 ? null : params.price,
    is_in_stock: params.is_ingredient ? params.is_in_stock : null,
  });

  if (error) {
    notifications.show({
      withCloseButton: false,
      message: error.message,
      title: error.name,
      position: "bottom-right",
      color: "red",
    });
    console.error(error);
  }
};
