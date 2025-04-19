export interface User {
  id: string;
  email: string;
  userName: string;
  role: string | Record<string, string>;
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

