import { RootState } from './store';

// User
export const UserInfoSelector = (state: RootState) => state.auth.userInfo;
export const AuthenticatedSelector = (state: RootState) => state.auth.isAuthenticated;
export const AuthLoadingSelector = (state: RootState) => state.auth.loading;
export const AuthBootstrappedSelector = (state: RootState) => state.auth.bootstrapped;

// Posts
export const PostLoadingSelector = (state: RootState) => state.post.loading;
export const PostErrorSelector = (state: RootState) => state.post.error;
export const PostsSelector = (state: RootState) => state.post.posts;
export const PostDetailSelector = (state: RootState) => state.post.selectedPost;

// Comments
export const LoadingCommentSelector = (state: RootState) => state.comment.loading;
export const ErrorCommentSelector = (state: RootState) => state.comment.error;
export const SuccessCommentSelector = (state: RootState) => state.comment.success;
export const CommentListSelector = (state: RootState) => state.comment.comments;
export const CommentSelector = (state: RootState) => state.comment.selectedComment;