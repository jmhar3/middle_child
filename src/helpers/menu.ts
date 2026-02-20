export interface Modifier {
  id: string;
  label: string;
  price?: number;
  isInStock?: boolean;
  isIngredient?: boolean;
  color?: string;
}

export interface ItemOptions {
  label: string;
  allowMultipleSelections: boolean;
  modifiers: Modifier[];
}

export interface MenuItemType {
  id: string;
  label: string;
  price: number;
  image?: string;
  isInStock?: boolean;
  ingredients?: Modifier[];
  hasLongPrepTime?: boolean;
  isLoyaltyApplicable?: boolean;
  modifiers?: Modifier[];
  modifierCategories?: ItemOptions[];
}

export interface MenuSection {
  label: string;
  items: MenuItemType[];
}

export const menu: MenuSection[] = [
  {
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
            label: "Temperature",
            allowMultipleSelections: false,
            modifiers: [
              { id: "3", label: "With Ice" },
              { id: "4", label: "Extra Hot" },
            ],
          },
          {
            label: "Strength",
            allowMultipleSelections: false,
            modifiers: [
              { id: "5", label: "Weak" },
              { id: "6", label: "Strong", price: 1 },
              { id: "8", label: "Decaf", isIngredient: true },
            ],
          },
          {
            label: "Milk",
            allowMultipleSelections: false,
            modifiers: [
              { id: "9", label: "Full Cream", isIngredient: true },
              { id: "10", label: "Skinny", isIngredient: true },
              { id: "11", label: "Lactose Free", isIngredient: true },
              { id: "12", label: "Soy", isIngredient: true },
              { id: "13", label: "Oat", isIngredient: true },
              { id: "14", label: "Almond", isIngredient: true },
            ],
          },
          {
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
            label: "Temperature",
            allowMultipleSelections: false,
            modifiers: [
              { id: "3", label: "With Ice" },
              { id: "4", label: "Extra Hot" },
            ],
          },
          {
            label: "Strength",
            allowMultipleSelections: false,
            modifiers: [
              { id: "5", label: "Weak" },
              { id: "6", label: "Strong", price: 1 },
              { id: "8", label: "Decaf", isIngredient: true },
            ],
          },
          {
            label: "Milk",
            allowMultipleSelections: false,
            modifiers: [
              { id: "9", label: "Full Cream", isIngredient: true },
              { id: "10", label: "Skinny", isIngredient: true },
              { id: "11", label: "Lactose Free", isIngredient: true },
              { id: "12", label: "Soy", isIngredient: true },
              { id: "13", label: "Oat", isIngredient: true },
              { id: "14", label: "Almond", isIngredient: true },
            ],
          },
          {
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
            label: "Temperature",
            allowMultipleSelections: false,
            modifiers: [
              { id: "3", label: "With Ice" },
              { id: "4", label: "Extra Hot" },
            ],
          },
          {
            label: "Strength",
            allowMultipleSelections: false,
            modifiers: [
              { id: "5", label: "Weak" },
              { id: "6", label: "Strong", price: 1 },
              { id: "8", label: "Decaf", isIngredient: true },
            ],
          },
          {
            label: "Milk",
            allowMultipleSelections: false,
            modifiers: [
              { id: "9", label: "Full Cream", isIngredient: true },
              { id: "10", label: "Skinny", isIngredient: true },
              { id: "11", label: "Lactose Free", isIngredient: true },
              { id: "12", label: "Soy", isIngredient: true },
              { id: "13", label: "Oat", isIngredient: true },
              { id: "14", label: "Almond", isIngredient: true },
            ],
          },
          {
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
          { id: "8", label: "Decaf", isIngredient: true },
        ],
        modifierCategories: [
          {
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
          { id: "8", label: "Decaf", isIngredient: true },
        ],
        modifierCategories: [
          {
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
            label: "Milk",
            allowMultipleSelections: false,
            modifiers: [
              { id: "9", label: "Full Cream", isIngredient: true },
              { id: "10", label: "Skinny", isIngredient: true },
              { id: "11", label: "Lactose Free", isIngredient: true },
              { id: "12", label: "Soy", isIngredient: true },
              { id: "13", label: "Oat", isIngredient: true },
              { id: "14", label: "Almond", isIngredient: true },
            ],
          },
          {
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
    label: "Milkshakes / Smoothies",
    items: [
      {
        id: "7",
        label: "Milkshake",
        price: 5,
        modifiers: [{ id: "1", label: "Make it a large", price: 1.5 }],
        modifierCategories: [
          {
            label: "Milk",
            allowMultipleSelections: false,
            modifiers: [
              { id: "9", label: "Full Cream", isIngredient: true },
              { id: "10", label: "Skinny", isIngredient: true },
              { id: "11", label: "Lactose Free", isIngredient: true },
              { id: "12", label: "Soy", isIngredient: true },
              { id: "13", label: "Oat", isIngredient: true },
              { id: "14", label: "Almond", isIngredient: true },
            ],
          },
          {
            label: "Flavours",
            allowMultipleSelections: true,
            modifiers: [
              { id: "27", label: "Strawberry", isIngredient: true },
              { id: "28", label: "Banana", isIngredient: true },
              { id: "29", label: "Chocolate", isIngredient: true },
              { id: "30", label: "Cookies", isIngredient: true },
              { id: "31", label: "Vanilla", isIngredient: true },
              { id: "32", label: "Caramel", isIngredient: true },
              { id: "33", label: "Mocha", isIngredient: true, price: 2.5 },
            ],
          },
        ],
      },
      {
        id: "8",
        label: "Jewel Smoothie",
        price: 5,
        ingredients: [
          { id: "34", label: "Almond Milk", isIngredient: true },
          { id: "35", label: "Banana", isIngredient: true },
          { id: "36", label: "Berries", isIngredient: true },
          { id: "37", label: "Agave", isIngredient: true },
        ],
      },
      {
        id: "9",
        label: "Daisy Smoothie",
        price: 5,
        ingredients: [
          { id: "38", label: "Coconut Water", isIngredient: true },
          { id: "39", label: "Cucumber", isIngredient: true },
          { id: "40", label: "Kiwi", isIngredient: true },
          { id: "41", label: "Spinach", isIngredient: true },
          { id: "42", label: "Mango", isIngredient: true },
          { id: "43", label: "Parsley", isIngredient: true },
          { id: "44", label: "Lemon", isIngredient: true },
        ],
      },
    ],
  },
  {
    label: "Pastries",
    items: [
      {
        id: "10",
        label: "Croissant",
        price: 5,
        isInStock: true,
        modifiers: [{ id: "45", label: "Warmed up" }],
      },
      {
        id: "11",
        label: "Almond Croissant",
        price: 5,
        isInStock: true,
        modifiers: [{ id: "45", label: "Warmed up" }],
      },
      {
        id: "12",
        label: "Hazelnut Cruffin",
        price: 5,
        isInStock: true,
        modifiers: [{ id: "45", label: "Warmed up" }],
      },
    ],
  },
  {
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
          { id: "46", label: "Bacon", isIngredient: true },
          { id: "47", label: "Egg", isIngredient: true },
          { id: "48", label: "Cheese", isIngredient: true },
          { id: "49", label: "Spinach", isIngredient: true },
        ],
        modifierCategories: [
          {
            label: "Add Ons",
            allowMultipleSelections: false,
            modifiers: [
              { id: "48", label: "Cheese", isIngredient: true },
              { id: "49", label: "Sourdough", isIngredient: true },
            ],
          },
          {
            label: "Remove",
            allowMultipleSelections: false,
            modifiers: [
              { id: "46", label: "Bacon", isIngredient: true },
              { id: "47", label: "Egg", isIngredient: true },
              { id: "48", label: "Cheese", isIngredient: true },
              { id: "49", label: "Spinach", isIngredient: true },
            ],
          },
        ],
      },
    ],
  },
];
