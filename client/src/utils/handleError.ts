import { clearAuthState } from '@/redux/slices/authSlice';
import { AxiosError } from 'axios';

export const handleError = async (error: AxiosError, rejectWithValue: Function, dispatch: any) => {
  if (error.response) {
    if (error.response.status === 401) {
      await dispatch(clearAuthState());
      console.log('Unauthorized. Please login again.');
    }

    return rejectWithValue(error.response?.data);
  }

  return rejectWithValue(error.message);
};
