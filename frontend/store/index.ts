// import { createStore, applyMiddleware } from "redux";
// import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import cryptoReducer from "./slice/index";
import storage from "redux-persist/lib/storage";
// import storage from "redux-persist/lib/storage"; // defaults to localStorage for web


// const persistConfig = {
//   key: "root",
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = createStore(persistedReducer);
// export const persistor = persistStore(store);

import { configureStore } from "@reduxjs/toolkit";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, cryptoReducer);

export const store = configureStore({
  reducer: {
    cryptoReducer: persistedReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
