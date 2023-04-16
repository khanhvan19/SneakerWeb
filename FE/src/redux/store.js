import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import * as rp from "redux-persist";
import storage from "redux-persist/lib/storage";

import themeReducer from "./slices/theme.slices";
import authReducer from "./slices/auth.slice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ['theme', 'auth'],
};

const reducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
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