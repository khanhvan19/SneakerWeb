import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import * as rp from "redux-persist";
import storage from "redux-persist/lib/storage";

import themeReducer from "./slices/theme.slices";
import employeeAuthReducer from "./slices/employeeAuth.slice";
import clientAuthReducer from "./slices/clientAuth.slice";
import shipperAuthReducer from "./slices/shipperAuth.slice";
import cartReducer from "./slices/cart.slice";
import favoriteReducer from "./slices/favorite.slice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ['theme', 'auth', 'client', 'shipper', 'cart', 'favorite']
};

const reducer = combineReducers({
  theme: themeReducer,
  auth: employeeAuthReducer,
  client: clientAuthReducer,
  shipper: shipperAuthReducer,
  cart: cartReducer,
  favorite: favoriteReducer
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [rp.FLUSH, rp.REHYDRATE, rp.PAUSE, rp.PERSIST, rp.PURGE, rp.REGISTER],
      },
    }),
})

export let persistor = persistStore(store);

export default store;