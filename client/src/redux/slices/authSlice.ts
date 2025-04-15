import axios, { AxiosError } from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API_AUTH_URL, API_USERS_URL } from '../../config';
import { RootState } from '../store';
import { Status } from '@/types/common';
import { Contact, Role, User } from '@/types/user';
import { handleError } from '@/utils/handleError';

interface AuthState {
  user: User | null;
  status: Status;
  isAuthenticated: boolean;
  isAdmin: boolean;
  error?: string;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: Status.IDLE,
  isAdmin: false,
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

export const uploadImage = createAsyncThunk(
  'user/uploadImage',
  async ({ type, file }: { type: string; file: any }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;

    try {
      if (!state.auth.user) {
        return;
      }

      const formData = new FormData();
      formData.append(type, file);
      const response = await axios.post(
        `${API_USERS_URL}/${state.auth.user.id}/${type}`,
        formData,
        {
          withCredentials: true,
        },
      );

      return { ...response.data, type };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response);
        return rejectWithValue(error.response?.data);
      }
    }
  },
);

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

      return { data: response.data, isOwnProfile };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
    }
  },
);

export const followUser = createAsyncThunk(
  'auth/followUser',
  async (userId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${API_USERS_URL}/follow/${userId}`,
        {},
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      handleError(error, rejectWithValue, dispatch);
    }
  },
);

export const unfollowUser = createAsyncThunk(
  'auth/unfollowUser',
  async (userId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${API_USERS_URL}/unfollow/${userId}`,
        {},
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      handleError(error, rejectWithValue, dispatch);
    }
  },
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (
    { profileData, userId }: { profileData: Partial<User>; userId?: string },
    { getState, rejectWithValue, dispatch },
  ) => {
    const state = getState() as RootState;
    const isOwnProfile = !userId;
    try {
      if (!state.auth.user) {
        return;
      }
      const response = await axios.patch(
        `${API_USERS_URL}/${userId || state.auth.user.id}`,
        profileData,
        {
          withCredentials: true,
        },
      );

      return { data: response.data, isOwnProfile };
    } catch (error) {
      handleError(error, rejectWithValue, dispatch);
    }
  },
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async ({ userId }: { userId?: string }, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as RootState;
    const isOwnProfile = !userId;
    try {
      if (!state.auth.user) {
        return rejectWithValue('User not found');
      }
      await axios.delete(`${API_USERS_URL}/${userId || state.auth.user.id}`, {
        withCredentials: true,
      });

      return { isOwnProfile };
    } catch (error) {
      handleError(error, rejectWithValue, dispatch);
    }
  },
);
export const createContact = createAsyncThunk(
  'user/createContact',
  async (contactData: Omit<Contact, 'id'>, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as RootState;

    try {
      if (!state.auth.user) {
        return rejectWithValue('User not found');
      }

      const existingContact = state.auth.user.contacts.find(
        (contact) => contact.type === contactData.type,
      );

      if (existingContact) {
        return rejectWithValue('Contact type already exists');
      }

      const response = await axios.post(
        `${API_USERS_URL}/${state.auth.user.id}/contacts`,
        contactData,
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      handleError(error, rejectWithValue, dispatch);
    }
  },
);

export const deleteContact = createAsyncThunk(
  'user/deleteContact',
  async (contactId: string, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as RootState;

    try {
      if (!state.auth.user) {
        return rejectWithValue('User not found');
      }

      await axios.delete(`${API_USERS_URL}/${state.auth.user.id}/contacts/${contactId}`, {
        withCredentials: true,
      });

      return contactId;
    } catch (error) {
      handleError(error, rejectWithValue, dispatch);
    }
  },
);

export const updateContact = createAsyncThunk(
  'user/updateContact',
  async (contactData: Partial<Contact>, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as RootState;

    const { id: contactId, ...contactDataWithoutId } = contactData;
    try {
      if (!state.auth.user) {
        return rejectWithValue('User not found');
      }

      const response = await axios.patch(
        `${API_USERS_URL}/${state.auth.user.id}/contacts/${contactId}`,
        contactDataWithoutId,
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      handleError(error, rejectWithValue, dispatch);
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
      state.status = Status.IDLE;
      state.isAdmin = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.status = Status.PENDING;
      })
      .addCase(signUp.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = Status.IDLE;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = undefined;
        state.isAdmin = action.payload?.role === Role.ADMIN ? true : false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.payload as string;
        state.isAdmin = false;
      })
      .addCase(signIn.pending, (state) => {
        state.status = Status.PENDING;
      })
      .addCase(signIn.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = Status.IDLE;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = undefined;
        state.isAdmin = action.payload?.role === Role.ADMIN ? true : false;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.isAdmin = false;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.status = Status.IDLE;
        state.user = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
      })
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload?.isOwnProfile) {
          return;
        }
        state.user = action.payload?.data;
        state.isAdmin = action.payload?.data?.role === Role.ADMIN ? true : false;

        if (state.user) {
          state.user.avatarPath = action.payload?.data?.avatarPath ?? '';
          state.user.coverPath = action.payload?.data?.coverPath ?? '';
        }
      })
      .addCase(uploadImage.pending, (state, action) => {
        if (state.user) {
          if (action.meta.arg.type === 'avatar') {
            state.user.avatarPath = null;
          } else {
            state.user.coverPath = null;
          }
        }
      })
      .addCase(uploadImage.fulfilled, (state, action: PayloadAction<any>) => {
        if (state.user) {
          if (action.payload.type === 'avatar') {
            state.user.avatarPath = action.payload?.path ?? '';
          } else {
            state.user.coverPath = action.payload?.path ?? '';
          }
        }
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload?.isOwnProfile) {
          return;
        }
        state.user = { ...state.user, ...action.payload };
        state.isAdmin = action.payload?.role === Role.ADMIN ? true : false;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<any>) => {
        if (action.payload.isOwnProfile) {
          state.user = null;
          state.isAuthenticated = false;
          state.isAdmin = false;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetError, setError, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
