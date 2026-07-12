import type { MenuItemType, Modifier, OrderItem } from "./state/types";

export const calculateOrderItemPrice = (
	menuItem: MenuItemType,
	modifiers?: Modifier[],
	is_large?: boolean,
) => {
	if (modifiers) {
		const modifiersTotalPrice = modifiers?.reduce((accumulator, modifier) => {
			return modifier.price ? accumulator + modifier.price : accumulator;
		}, 0);
		if (is_large && menuItem.large_price)
			return modifiersTotalPrice + menuItem.large_price;
		return modifiersTotalPrice + menuItem.price;
	}
	if (is_large && menuItem.large_price) return menuItem.large_price;
	return menuItem.price;
};

export const formatPrice = (price: number) => {
	if (price === 0) {
		return "FREE";
	} else if (price % 1 !== 0) {
		return `$${price.toFixed(2)}`;
	} else {
		return `$${price}`;
	}
};

export const filterItemFromOrder = (
	existingItems: OrderItem[],
	filterItem: OrderItem,
) => existingItems.filter((existingItem) => existingItem !== filterItem);

export const getMinutesFromNow = (targetDate: Date) => {
	const now = Date.now(); // Current time in milliseconds
	const targetTime = targetDate.getTime(); // Target date in milliseconds

	const differenceInMilliseconds = targetTime - now;
	// 1000 milliseconds/second * 60 seconds/minute = 60000 milliseconds/minute
	const differenceInMinutes = differenceInMilliseconds / 60000;

	// Use Math.floor() or Math.ceil() depending on desired behavior, or leave as is for a precise value
	return differenceInMinutes;
};
