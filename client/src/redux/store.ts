import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postReducer from './slices/postSlice';
import socketReducer from './slices/socketSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import { createSocketMiddleware } from '@/middlewares/socketMiddleware';
import { API_BASE_URL_WS } from '@/config';

const persistConfig = {
  key: 'root',
  storage,
};

const socketMiddleware = createSocketMiddleware(API_BASE_URL_WS);

const rootReducer = combineReducers({
  auth: authReducer,
  post: postReducer,
  socket: socketReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(socketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
