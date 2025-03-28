import axios, { AxiosError } from 'axios';
import { createAsyncThunk, createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { API_AUTH_URL, API_USERS_URL } from '../../config';
import { RootState } from '../store';

interface User {
  id: string;
  email: string;
  role: string;
  username: string;
  avatarPath: string | null;
  coverPath: string | null;
}

interface AuthState {
  user: User | null;
  status: 'idle' | 'pending' | 'failed';
  isAuthenticated: boolean;
  error?: string;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
};

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (
    credentials: { username: string; email: string; password: string; role: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(`${API_AUTH_URL}/sign-up`, credentials, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response);
        return rejectWithValue(error.response?.data);
      }
    }
  },
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_AUTH_URL}/sign-in`, credentials, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response);
        return rejectWithValue(error.response?.data);
      }
    }
  },
);

export const signOut = createAsyncThunk('user/signOut', async () => {
  try {
    await axios.post(`${API_AUTH_URL}/sign-out`, null, {
      withCredentials: true,
    });
  } catch (_) {
  } finally {
    return true;
  }
});

export const getProfile = createAsyncThunk(
  'user/getProfile',
  async ({ userId }: { userId?: string }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const isOwnProfile = !userId;

    console.log('isOwnProfile', isOwnProfile);

    try {
      console.log('route', `${API_USERS_URL}/${userId ?? state.auth.user?.id}`);
      const response = await axios.get(`${API_USERS_URL}/${userId ?? state.auth.user?.id}`, {
        withCredentials: true,
      });
      console.log('Get profile response', response);

      return { data: response.data, isOwnProfile };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
        // handleError(error, rejectWithValue, dispatch);
      }
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    resetError(state) {
      state.error = undefined;
    },
    clearAuthState(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(signUp.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'idle';
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = undefined;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(signIn.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(signIn.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'idle';
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = undefined;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.status = 'idle';
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<any>) => {
        console.log('Payload', action.payload);
        console.log('User', state.user);
        if (!action.payload?.isOwnProfile) {
          return;
        }
        state.user = action.payload?.data;

        if (state.user) {
          state.user.avatarPath = action.payload?.data?.avatarPath ?? '';
          state.user.coverPath = action.payload?.data?.coverPath ?? '';
        }
      })
  },
});

export const { resetError, setError, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
