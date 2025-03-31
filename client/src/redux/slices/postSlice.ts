import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API_POSTS_URL } from '../../config';
import axios, { AxiosError } from 'axios';
import { Status } from '@/types/common';
import { CreatePost, CreateRepost, Post, UpdatePost } from '@/types/post';
import { Like } from '@/types/like';

interface PostState {
  posts: Post[] | null;
  status: Status;
  error?: string;
}

const initialState: PostState = {
  posts: null,
  status: Status.IDLE,
};

export const getPosts = createAsyncThunk('post/getPosts', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_POSTS_URL}/`, {
      withCredentials: true,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data);
    }
  }
});
export const createRepost = createAsyncThunk(
  'post/createRepost',
  async (
    { postId, repostData }: { postId: string; repostData: CreateRepost },
    { rejectWithValue },
  ) => {
    try {
      console.log(`postSlice createRepost ${postId} ${repostData}`);
      const response = await axios.post(`${API_POSTS_URL}/${postId}/reposts`, repostData, {
        withCredentials: true,
      });
      console.log('Response', response);
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
  async ({ postId }: { postId: string }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_POSTS_URL}/${postId}`, { withCredentials: true });
      return postId;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
    }
  },
);

export const createPost = createAsyncThunk(
  'post/createPost',
  async (data: CreatePost, { rejectWithValue }) => {
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
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
    }
  },
);

export const updatePost = createAsyncThunk(
  'post/updatePost',
  async ({ postId, data }: { postId: string; data: UpdatePost }, { rejectWithValue }) => {
    try {
      console.log('Update data', data);
      const formData = new FormData();
      if (data.content) formData.append('content', data.content);
      if (data.privacy) formData.append('privacy', data.privacy);

      if (data.file) {
        formData.append('file', data.file);
      }
      console.log('Update formData', data);

      const response = await axios.patch(`${API_POSTS_URL}/${postId}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
    }
  },
);

export const toggleLike = createAsyncThunk(
  'posts/toggleLike',
  async (
    { postId, isLiked, likeId }: { postId: string; isLiked: boolean; likeId?: string },
    { rejectWithValue },
  ) => {
    try {
      console.log('Toggle like');
      console.log({ postId, isLiked, likeId });
      if (isLiked) {
        console.log('isLiked', isLiked);
        const res = await axios.delete(`${API_POSTS_URL}/likes/${likeId}`, {
          withCredentials: true,
        });
        console.log('Delete result', res);
        return { postId, likeId, isLiked: false };
      } else {
        const res = await axios.post(`${API_POSTS_URL}/${postId}/likes`, null, {
          withCredentials: true,
        });
        console.log(res);
        return { postId, like: res.data, isLiked: true };
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response);
        return rejectWithValue(error.response?.data);
      }
    }
  },
);
export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ content, postId }: { content: string; postId: string }, { rejectWithValue }) => {
    console.log(`Content ${content} postId ${postId}`);
    try {
      console.log('Content of comment to create', content);
      const response = await axios.post(
        `${API_POSTS_URL}/${postId}/comments`,
        { content },
        {
          withCredentials: true,
        },
      );
      console.log('Create comment response', response);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response);
        return rejectWithValue(error.response?.data);
      }
    }
  },
);
export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ content, commentId }: { content: string; commentId: string }, { rejectWithValue }) => {
    console.log(`Content ${content} commentId ${commentId}`);
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
      if (error instanceof AxiosError) {
        console.log(error.response);
        return rejectWithValue(error.response?.data);
      }
    }
  },
);
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ commentId }: { commentId: string }, { rejectWithValue }) => {
    console.log(`Content commentId ${commentId}`);
    try {
      const response = await axios.delete(`${API_POSTS_URL}/comments/${commentId}`, {
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

export const getComments = createAsyncThunk(
  'comments/getComments',
  async ({ postId }: { postId: string }, { rejectWithValue }) => {
    console.log(`Content postId ${postId}`);
    try {
      const response = await axios.get(`${API_POSTS_URL}/${postId}/comments`, {
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
        const post = state?.posts!.find((post: Post) => post.id === postId);
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
