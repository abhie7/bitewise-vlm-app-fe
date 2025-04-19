import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { toast } from 'sonner'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
// Types
interface User {
  uuid: string;
  email: string;
  userName: string;
}

interface AuthState {
  user: User | null;
  isAuthLoading: boolean;
  isAuthError: string | null;
  isAuthSuccess: boolean;
  token: string | null;
}

const getUserFromStorage = (): User | null => {
  const storedUser = sessionStorage.getItem('user')
  if (!storedUser) return null
  try {
    return JSON.parse(storedUser) as User
  } catch {
    return null
  }
}

const initialState: AuthState = {
  user: getUserFromStorage(),
  isAuthLoading: false,
  isAuthError: null,
  isAuthSuccess: false,
  token: null,
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk<User, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email.toLowerCase(),
        password
      })
      const userData = response.data
      sessionStorage.setItem('user', JSON.stringify(userData))
      return userData
    } catch (error: any) {
      console.error('Login error:', error)
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Login failed'
      )
    }
  }
)

interface RegisterCredentials {
  email: string;
  password: string;
  userName: string;
}

export const createUser = createAsyncThunk<User, RegisterCredentials, { rejectValue: string }>(
  'auth/register',
  async ({ email, password, userName }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        userName
      })
      const userData = response.data
      sessionStorage.setItem('user', JSON.stringify(userData))
      return userData
    } catch (error: any) {
      console.error('Registration error:', error)
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Registration failed'
      )
    }
  }
)

interface ResetPasswordData {
  email: string;
  newPassword: string;
}

export const resetPassword = createAsyncThunk<void, ResetPasswordData, { rejectValue: string }>(
  'auth/resetPassword',
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        newPassword
      })
    } catch (error: any) {
      console.error('Password reset error:', error)
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Password reset failed'
      )
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      sessionStorage.removeItem('user')
      return null
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      if (action.payload) {
        sessionStorage.setItem('user', JSON.stringify(action.payload))
      } else {
        sessionStorage.removeItem('user')
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isAuthLoading = true
        state.isAuthSuccess = false
        state.isAuthError = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthLoading = false
        state.isAuthSuccess = true
        state.user = action.payload
        state.isAuthError = null

        toast.success(`Welcome ${action.payload.userName}`)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthLoading = false
        state.user = null
        state.isAuthSuccess = false
        state.isAuthError = action.payload || 'Login failed'
        toast.error(`Login failed: ${action.payload}`)
      })
      .addCase(createUser.pending, (state) => {
        state.isAuthLoading = true
        toast.info('Registering...')
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isAuthLoading = false
        state.isAuthSuccess = true
        state.user = action.payload
        state.isAuthError = null
        toast.success(`Welcome ${action.payload.userName}`)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isAuthLoading = false
        state.isAuthError = action.payload || 'Registration failed'
        toast.error(`Registration failed: ${action.payload}`)
      })
      .addCase(resetPassword.pending, (state) => {
        state.isAuthLoading = true
        toast.info('Resetting password...')
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isAuthLoading = false
        state.isAuthSuccess = true
        toast.success('Password reset successfully!')
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isAuthLoading = false
        state.isAuthError = action.payload || 'Password reset failed'
        toast.error(`Password reset failed: ${action.payload}`)
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthSuccess = false
        state.isAuthError = null
        sessionStorage.clear()
        toast.success('Logged out successfully!')
      })
  },
})

export const { setUser } = authSlice.actions
export default authSlice.reducer