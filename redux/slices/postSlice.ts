import axios from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { del, get, post, put } from "../../services/api";

export type PostLink = {
  id?: string;
  label: string;
  url: string;
  sortOrder?: number;
};

export type PostImage = {
  id?: string;
  url: string;
  alt?: string | null;
  sortOrder?: number;
};

export type Post = {
  author?: {
    id: string;
    fullName: string;
    role?: string;
    email?: string;
  };
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  category?: string | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
  thumbnailUrl?: string | null;
  status?: "draft" | "published";
  links?: PostLink[];
  images?: PostImage[];
};

type ApiResponse<T> = {
  message?: string;
  data: T;
};

type CreatePostPayload = FormData;

type UpdatePostPayload = {
  id: string;
  data: FormData;
};

type DeletePostPayload = {
  id: string;
};

type GetPostBySlugPayload = {
  slug: string;
};

type GetAllPostsResponse = Post[];
type GetPostBySlugResponse = Post;
type CreatePostResponse = Post;
type UpdatePostResponse = Post;
type DeletePostResponse = {
  message?: string;
  id?: string;
};

type ApiError = {
  message: string;
};

type PostState = {
  posts: Post[];
  postsAdmin: Post[];
  selectedPost: Post | null;
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

  if (typeof error === "object" && error !== null && "message" in error) {
    return { message: String((error as { message: unknown }).message) };
  }

  return { message: fallback };
};

export const createPost = createAsyncThunk<
  CreatePostResponse,
  CreatePostPayload,
  { rejectValue: ApiError }
>("post/createPost", async (payload, { rejectWithValue }) => {
  try {
    const response = await post<ApiResponse<CreatePostResponse>>("/posts", payload, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorPayload(error, "Tạo bài viết thất bại"));
  }
});

export const getAllPosts = createAsyncThunk<
  GetAllPostsResponse,
  void,
  { rejectValue: ApiError }
>("post/getAllPosts", async (_, { rejectWithValue }) => {
  try {
    const response = await get<ApiResponse<GetAllPostsResponse>>("/posts");
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      getErrorPayload(error, "Lấy danh sách bài viết thất bại"),
    );
  }
});

export const getAllPostsAdmin = createAsyncThunk<
  GetAllPostsResponse,
  void,
  { rejectValue: ApiError }
>("post/getAllPostsAdmin", async (_, { rejectWithValue }) => {
  try {
    const response = await get<ApiResponse<GetAllPostsResponse>>("/posts/admin/all");
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      getErrorPayload(error, "Lấy danh sách bài viết thất bại"),
    );
  }
});

export const getPostBySlug = createAsyncThunk<
  GetPostBySlugResponse,
  GetPostBySlugPayload,
  { rejectValue: ApiError }
>("post/getPostBySlug", async ({ slug }, { rejectWithValue }) => {
  try {
    const response = await get<ApiResponse<GetPostBySlugResponse>>(`/posts/${slug}`);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      getErrorPayload(error, "Lấy bài viết theo slug thất bại"),
    );
  }
});

export const updatePost = createAsyncThunk<
  UpdatePostResponse,
  UpdatePostPayload,
  { rejectValue: ApiError }
>("post/updatePost", async ({ id, data: payload }, { rejectWithValue }) => {
  try {
    const response = await put<ApiResponse<UpdatePostResponse>>(`/posts/${id}`, payload, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      getErrorPayload(error, "Cập nhật bài viết thất bại"),
    );
  }
});

export const deletePost = createAsyncThunk<
  DeletePostPayload,
  DeletePostPayload,
  { rejectValue: ApiError }
>("post/deletePost", async ({ id }, { rejectWithValue }) => {
  try {
    await del<DeletePostResponse>(`/posts/${id}`, {
      withCredentials: true,
    });
    return { id };
  } catch (error: unknown) {
    return rejectWithValue(getErrorPayload(error, "Xóa bài viết thất bại"));
  }
});

const initialState: PostState = {
  posts: [],
  postsAdmin:[],
  selectedPost: null,
  loading: false,
  error: null,
  success: false,
};

export const postSlice = createSlice({
  name: "postSlice",
  initialState,
  reducers: {
    clearPostState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
    setSelectedPost: (state, action: PayloadAction<Post | null>) => {
      state.selectedPost = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
        state.selectedPost = action.payload;
        state.success = true;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Tạo bài viết thất bại" };
        state.success = false;
      })

      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Lấy danh sách bài viết thất bại",
        };
      })

       .addCase(getAllPostsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPostsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.postsAdmin = action.payload;
      })
      .addCase(getAllPostsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Lấy danh sách bài viết thất bại",
        };
      })

      .addCase(getPostBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPost = action.payload;
      })
      .addCase(getPostBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Lấy bài viết theo slug thất bại",
        };
        state.selectedPost = null;
      })

      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post,
        );

        if (state.selectedPost?.id === action.payload.id) {
          state.selectedPost = action.payload;
        }

        state.success = true;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Cập nhật bài viết thất bại",
        };
        state.success = false;
      })

      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(
          (post) => post.id !== action.payload.id,
        );

        if (state.selectedPost?.id === action.payload.id) {
          state.selectedPost = null;
        }

        state.success = true;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Xóa bài viết thất bại" };
        state.success = false;
      });
  },
});

export const { clearPostState, clearSelectedPost, setSelectedPost } =
  postSlice.actions;

export default postSlice.reducer;