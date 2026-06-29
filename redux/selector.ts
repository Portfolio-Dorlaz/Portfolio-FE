import { RootState } from './store';

export const UserInfoSelector = (state: RootState) => state.auth.userInfo;
export const AuthenticatedSelector = (state: RootState) => state.auth.isAuthenticated;
export const AuthLoadingSelector = (state: RootState) => state.auth.loading;
export const AuthBootstrappedSelector = (state: RootState) => state.auth.bootstrapped;