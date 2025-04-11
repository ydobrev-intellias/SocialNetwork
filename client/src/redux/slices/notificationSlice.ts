import { User } from '@/types/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  targetId: string;
  content: string;
  eventTime: Date;
}

interface NotificationState {
  isConnected: boolean;
  notifications: Notification[];
  selectedUser: User | null;
  error: string | null;
}

const initialState: NotificationState = {
  isConnected: false,
  notifications: [],
  selectedUser: null,
  error: null,
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    connect: (_state, _action: PayloadAction<{ userId: string }>) => {},
    connected: (state) => {
      state.isConnected = true;
    },
    disconnect: () => {},
    disconnected: (state) => {
      state.isConnected = false;
    },
    notificationsReceived: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    notificationRead: (state, action: PayloadAction<{ id: string }>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload.id,
      );
    },
    errorOccurred: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const notificationActions = notificationSlice.actions;
export default notificationSlice.reducer;
