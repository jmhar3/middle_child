export interface OrderTime {
	id: string;
	label: string;
	short: number;
	long: number;
	order: number;
}

export interface StoreInfo {
	id: string;
	is_open: boolean;
	current_order_time: OrderTime;
}

export interface Modifier {
	id: string;
	label: string;
	price?: number;
	is_in_stock?: boolean;
	is_ingredient?: boolean;
	reference_code?: string;
	description?: string;
	order?: number;
}

export interface ItemOptions {
	id: string;
	label: string;
	allow_multiple_selections: boolean;
	is_required: boolean;
	modifiers: Modifier[];
	order?: number;
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
	reference_code?: string;
}

export interface MenuSection {
	id: string;
	label: string;
	order: number;
	items: MenuItemType[];
	is_in_stock?: boolean;
}

export interface User {
	id: string;
	name: string;
	is_admin: boolean;
	loyalty_points?: number;
	recent_items?: OrderItem[];
	orders?: PlacedOrderType[];
}

export interface OrderItem {
	id: string;
	item: MenuItemType;
	modifiers?: Modifier[];
	quantity: number;
	note?: string;
}

export interface Cart {
	items: OrderItem[];
	total: number;
	pickUpTime: number;
	notes?: string;
}

export interface PendingOrderType {
	due_at: string;
	total: number;
	note?: string;
	items: OrderItem[];
	is_complete: boolean;
}

export interface PlacedOrderType {
	id: string;
	user: User;
	due_at: string;
	total: number;
	note?: string;
	items: OrderItem[];
	is_complete: boolean;
}

export interface SupabaseOrderItem {
	id: string;
	note?: string;
	quantity: number;
	menu_item: SupabaseMenuItem;
	order_items_modifiers: { modifiers: Modifier }[];
}

export interface SupabaseOrders {
	id: string;
	created_at: string;
	due_at: string;
	is_complete: boolean;
	note?: string;
	total: number;
	user: User;
	order_items: SupabaseOrderItem[];
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
