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
