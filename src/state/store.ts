import { configureStore } from "@reduxjs/toolkit";

import menuReducer from "./menu/menuSlice";
import menuItemsReducer from "./menuItems/menuItemsSlice";
import modifiersReducer from "./modifiers/modifiersSlice";
import itemOptionsReducer from "./itemOptions/itemOptionsSlice";
import storeInfoReducer from "./storeInfo/storeInfoSlice";
import orderTimesReducer from "./orderTimes/orderTimesSlice";

import type { Action, ThunkAction } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    itemOptions: itemOptionsReducer,
    menu: menuReducer,
    menuItems: menuItemsReducer,
    modifiers: modifiersReducer,
    orderTimes: orderTimesReducer,
    storeInfo: storeInfoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
