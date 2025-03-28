import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';


interface PostState {
  posts: any[] | null;
  status: 'idle' | 'pending' | 'failed';
  error?: string;
}

const initialState: PostState = {
  posts: null,
  status: 'idle',
};


const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
});
export const {} = postSlice.actions;
export default postSlice.reducer;
