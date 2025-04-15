import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API_POSTS_URL } from '../../config';
import axios, { AxiosError } from 'axios';
import { Status } from '@/types/common';
import { CreatePost, CreateRepost, Post, UpdatePost } from '@/types/post';
import { Like } from '@/types/like';
import { handleError } from '@/utils/handleError';

interface PostState {
  posts: Post[] | null;
  status: Status;
  error?: string;
}

const initialState: PostState = {
  posts: null,
  status: Status.IDLE,
};

export const getPosts = createAsyncThunk(
  'post/getPosts',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get(`${API_POSTS_URL}/`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleError(error, rejectWithValue, dispatch);
    }
  },
);
export const createRepost = createAsyncThunk(
  'post/createRepost',
  async (
    { postId, repostData }: { postId: string; repostData: CreateRepost },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(`${API_POSTS_URL}/${postId}/reposts`, repostData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
        return rejectWithValue(error.response?.data);
      }
    }
  },
);

export const deletePost = createAsyncThunk(
  'post/deletePost',
  async ({ postId }: { postId: string }, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`${API_POSTS_URL}/${postId}`, { withCredentials: true });
      return postId;
    } catch (error) {
      handleError(error, rejectWithValue, dispatch);
    }
  },
);

export const createPost = createAsyncThunk(
  'post/createPost',
  async (data: CreatePost, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append('content', data.content);
      formData.append('privacy', data.privacy);

      if (data.file) {
        formData.append('file', data.file);
      }

      const response = await axios.post(`${API_POSTS_URL}/`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      handleError(error, rejectWithValue, dispatch);
    }
  },
);

export const updatePost = createAsyncThunk(
  'post/updatePost',
  async ({ postId, data }: { postId: string; data: UpdatePost }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      if (data.content) formData.append('content', data.content);
      if (data.privacy) formData.append('privacy', data.privacy);

      if (data.file) {
        formData.append('file', data.file);
      }

      const response = await axios.patch(`${API_POSTS_URL}/${postId}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      handleError(error, rejectWithValue, dispatch);
    }
  },
);

export const toggleLike = createAsyncThunk(
  'posts/toggleLike',
  async (
    { postId, isLiked, likeId }: { postId: string; isLiked: boolean; likeId?: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      if (isLiked) {
        await axios.delete(`${API_POSTS_URL}/likes/${likeId}`, {
          withCredentials: true,
        });
        return { postId, likeId, isLiked: false };
      } else {
        const res = await axios.post(
          `${API_POSTS_URL}/${postId}/likes`,
          {},
          {
            withCredentials: true,
          },
        );
        return { postId, like: res.data, isLiked: true };
      }
    } catch (error) {
      handleError(error, rejectWithValue, dispatch);
    }
  },
);
export const createComment = createAsyncThunk(
  'comments/createComment',
  async (
    { content, postId }: { content: string; postId: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await axios.post(
        `${API_POSTS_URL}/${postId}/comments`,
        { content },
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
export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async (
    { content, commentId }: { content: string; commentId: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await axios.patch(
        `${API_POSTS_URL}/comments/${commentId}`,
        { content },
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
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ commentId }: { commentId: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.delete(`${API_POSTS_URL}/comments/${commentId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleError(error, rejectWithValue, dispatch);
    }
  },
);

export const getComments = createAsyncThunk(
  'comments/getComments',
  async ({ postId }: { postId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_POSTS_URL}/${postId}/comments`, {
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

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.status = Status.PENDING;
      })
      .addCase(getPosts.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = Status.IDLE;
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.payload as string;
      })
      .addCase(createPost.pending, (state) => {
        state.status = Status.PENDING;
      })
      .addCase(createPost.rejected, (state) => {
        state.status = Status.FAILED;
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.status = Status.IDLE;
        state.posts?.unshift(action.payload);
      })
      .addCase(createRepost.pending, (state) => {
        state.status = Status.PENDING;
      })
      .addCase(createRepost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.status = Status.IDLE;
        state.posts?.unshift(action.payload);
      })
      .addCase(createComment.fulfilled, (state) => {
        state.status = Status.IDLE;
      })
      .addCase(updateComment.fulfilled, (state) => {
        state.status = Status.IDLE;
      })
      .addCase(deleteComment.fulfilled, (state) => {
        state.status = Status.IDLE;
      })
      .addCase(getComments.fulfilled, (state) => {
        state.status = Status.IDLE;
      })

      .addCase(toggleLike.fulfilled, (state, action: PayloadAction<any>) => {
        const { postId, like, isLiked, likeId } = action.payload;
        const post = state?.posts!.find((post: Post) => post?.id === postId);
        if (!post) return;

        if (post.likes)
          if (isLiked) {
            post.likes.push(like);
          } else {
            post.likes = post.likes.filter((like: Like) => like.id !== likeId);
          }
      });
  },
});
export const {} = postSlice.actions;
export default postSlice.reducer;
