import { clearAuthState } from '@/redux/slices/authSlice';
import { AxiosError } from 'axios';

export const handleError = async (error: any, rejectWithValue: Function, dispatch: any) => {
  if (error instanceof AxiosError && error.response) {
    if (error.response.status === 401) {
      await dispatch(clearAuthState());
      console.log('Unauthorized. Please login again.');
    }

    return rejectWithValue(error.response);
  }

  return rejectWithValue(error.message);
};
