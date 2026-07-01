import axios from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { del, get, post, put } from '../../services/api';

type CommentAuthor = {
  id: string;
  fullName: string;
};

export type Comment = {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  createdAt?: string;
  updatedAt?: string;
  author?: CommentAuthor;
  replies?: Comment[];
};

type CreateCommentPayload = {
  content: string;
  postId: string;
  parentId?: string | null;
};

type UpdateCommentPayload = {
  id: string;
  content?: string;
};

type DeleteCommentPayload = {
  id: string;
};

type GetCommentsByPostPayload = {
  postId: string;
};

type GetCommentByIdPayload = {
  id: string;
};

type GetCommentsByPostResponse = {
  message: string;
  data: Comment[];
};

type GetCommentByIdResponse = Comment;
type CreateCommentResponse = Comment;
type UpdateCommentResponse = Comment;
type DeleteCommentResponse = {
  message?: string;
  id?: string;
};

type ApiError = {
  message: string;
};

type CommentState = {
  comments: Comment[];
  selectedComment: Comment | null;
  loading: boolean;
  error: ApiError | null;
  success: boolean;
};

const getErrorPayload = (error: unknown, fallback: string): ApiError => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as ApiError | undefined) || {
        message: fallback,
      }
    );
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return { message: String((error as { message: unknown }).message) };
  }

  return { message: fallback };
};

export const createComment = createAsyncThunk<
  CreateCommentResponse,
  CreateCommentPayload,
  { rejectValue: ApiError }
>('comment/createComment', async (payload, { rejectWithValue }) => {
  try {
    const data = await post<CreateCommentResponse>('/comments', payload);
    return data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorPayload(error, 'Tạo comment thất bại'));
  }
});

export const getCommentsByPost = createAsyncThunk<
  GetCommentsByPostResponse,
  GetCommentsByPostPayload,
  { rejectValue: ApiError }
>('comment/getCommentsByPost', async ({ postId }, { rejectWithValue }) => {
  try {
    const data = await get<GetCommentsByPostResponse>(`/comments/post/${postId}`);
    return data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorPayload(error, 'Lấy danh sách comment thất bại'));
  }
});

export const getCommentById = createAsyncThunk<
  GetCommentByIdResponse,
  GetCommentByIdPayload,
  { rejectValue: ApiError }
>('comment/getCommentById', async ({ id }, { rejectWithValue }) => {
  try {
    const data = await get<GetCommentByIdResponse>(`/comments/${id}`);
    return data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorPayload(error, 'Lấy comment thất bại'));
  }
});

export const updateComment = createAsyncThunk<
  UpdateCommentResponse,
  UpdateCommentPayload,
  { rejectValue: ApiError }
>('comment/updateComment', async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    const data = await put<UpdateCommentResponse>(`/comments/${id}`, payload);
    return data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorPayload(error, 'Cập nhật comment thất bại'));
  }
});

export const deleteComment = createAsyncThunk<
  DeleteCommentPayload,
  DeleteCommentPayload,
  { rejectValue: ApiError }
>('comment/deleteComment', async ({ id }, { rejectWithValue }) => {
  try {
    await del<DeleteCommentResponse>(`/comments/${id}`);
    return { id };
  } catch (error: unknown) {
    return rejectWithValue(getErrorPayload(error, 'Xóa comment thất bại'));
  }
});

const initialState: CommentState = {
  comments: [],
  selectedComment: null,
  loading: false,
  error: null,
  success: false,
};

const updateCommentInTree = (comments: Comment[], updatedComment: Comment): Comment[] => {
  return comments.map((comment) => {
    if (comment.id === updatedComment.id) {
      return {
        ...comment,
        ...updatedComment,
      };
    }

    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentInTree(comment.replies, updatedComment),
      };
    }

    return comment;
  });
};

const deleteCommentInTree = (comments: Comment[], deletedId: string): Comment[] => {
  return comments
    .filter((comment) => comment.id !== deletedId)
    .map((comment) => ({
      ...comment,
      replies: comment.replies ? deleteCommentInTree(comment.replies, deletedId) : [],
    }));
};

export const commentSlice = createSlice({
  name: 'commentSlice',
  initialState,
  reducers: {
    clearCommentState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearSelectedComment: (state) => {
      state.selectedComment = null;
    },
    setSelectedComment: (state, action: PayloadAction<Comment | null>) => {
      state.selectedComment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.unshift({
          ...action.payload,
          replies: action.payload.replies || [],
        });
        state.success = true;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Tạo comment thất bại' };
        state.success = false;
      })

      .addCase(getCommentsByPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommentsByPost.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.data;
      })
      .addCase(getCommentsByPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Lấy danh sách comment thất bại' };
      })

      .addCase(getCommentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedComment = action.payload;
      })
      .addCase(getCommentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Lấy comment thất bại' };
        state.selectedComment = null;
      })

      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = updateCommentInTree(state.comments, action.payload);

        if (state.selectedComment?.id === action.payload.id) {
          state.selectedComment = action.payload;
        }

        state.success = true;
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Cập nhật comment thất bại' };
        state.success = false;
      })

      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = deleteCommentInTree(state.comments, action.payload.id);

        if (state.selectedComment?.id === action.payload.id) {
          state.selectedComment = null;
        }

        state.success = true;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Xóa comment thất bại' };
        state.success = false;
      });
  },
});

export const { clearCommentState, clearSelectedComment, setSelectedComment } =
  commentSlice.actions;

export default commentSlice.reducer;