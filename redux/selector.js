// USER INFO
export const LoadingUserSelector = (state) => state.auth.loading;
export const UserInfoSelector = (state) => state.auth.userInfo;
export const AuthenticatedSelector = (state) => state.auth.isAuthenticated;
export const ErrorUserSelector = (state) => state.auth.error;
