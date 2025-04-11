import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postReducer from './slices/postSlice';
import messageReducer from './slices/messageSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import { API_BASE_URL_WS } from '@/config';
import { createMessageSocketMiddleware } from '@/middlewares/messageSocketMiddleware';
import { createNotificationSocketMiddleware } from '@/middlewares/notificationSocketMiddleware';
import notificationReducer from './slices/notificationSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const messageSocketMiddleware = createMessageSocketMiddleware(API_BASE_URL_WS);
const notificationSocketMiddleware = createNotificationSocketMiddleware(API_BASE_URL_WS);

const rootReducer = combineReducers({
  auth: authReducer,
  post: postReducer,
  message: messageReducer,
  notification: notificationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(messageSocketMiddleware, notificationSocketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
