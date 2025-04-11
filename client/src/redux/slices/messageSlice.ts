import { User } from '@/types/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp?: Date;
}

interface MessageState {
  isConnected: boolean;
  messages: Message[];
  selectedUser: User | null;
  error: string | null;
}

const initialState: MessageState = {
  isConnected: false,
  messages: [],
  selectedUser: null,
  error: null,
};

export const messageSlice = createSlice({
  name: 'message',
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
    sendMessage: (_state, _action: PayloadAction<Message>) => {},
    getMessages: (_state, _action: PayloadAction<{ receiverId: string }>) => {},
    messageReceived: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    messagesReceived: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    deleteMessage: (_state, _action: PayloadAction<{ messageId: string }>) => {},
    messageDeleted: (state, action) => {
      state.messages = state.messages.filter((message) => message.id !== action.payload);
    },
    updateMessage: (
      _state,
      _action: PayloadAction<{ newContent: string; messageId: string }>,
    ) => {},
    messageUpdated: (state, action) => {
      const message = state.messages.find((message) => message.id === action.payload.id);
      if (message) message!.content = action.payload.content;
    },
    errorOccurred: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const messageActions = messageSlice.actions;
export default messageSlice.reducer;
