export interface User {
  uuid: string;
  email: string;
  userName: string;
}

export interface AuthState {
  user: User | null;
  isAuthLoading: boolean;
  isAuthError: string | null;
  isAuthSuccess: boolean;
  token: string | null;
}

export interface RootState {
  auth: AuthState;
}

