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
  allow_multiple_selections: boolean;
  is_required: boolean;
  modifiers: Modifier[];
}

export interface MenuItemType {
  id: string;
  label: string;
  description?: string;
  price: number;
  image?: string;
  is_in_stock: boolean;
  has_long_prep_time: boolean;
  is_applicable_loyalty_item: boolean;
  modifierCategories?: ItemOptions[];
  modifiers?: Modifier[];
  order: number;
}

export interface MenuSection {
  id: string;
  label: string;
  order: number;
  items: MenuItemType[];
}

export interface SupabaseItemOptions {
  id: string;
  label: string;
  is_required: boolean;
  allow_multiple_selections: boolean;
  options_modifiers: { modifiers: Modifier }[];
}

export interface SupabaseMenuItem {
  id: string;
  label: string;
  price: number;
  image?: string;
  order: number;
  description?: string;
  is_in_stock: boolean;
  has_long_prep_time: boolean;
  is_applicable_loyalty_item: boolean;
  menu_items_modifiers: { modifiers: Modifier }[];
  menu_items_options: { options: SupabaseItemOptions }[];
}

export interface SupabaseSection {
  id: string;
  label: string;
  order: number;
  menu_items: SupabaseMenuItem[];
}
