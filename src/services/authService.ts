import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { toast } from 'sonner'
import axios from 'axios'
import socketClient from '../sockets/socketClient'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
// Types
interface User {
  uuid: string
  email: string
  userName: string
}

interface AuthState {
  user: User | null
  isAuthLoading: boolean
  isAuthError: string | null
  isAuthSuccess: boolean
  token: string | null
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
  email: string
  password: string
}

export const loginUser = createAsyncThunk<
  User,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: email.toLowerCase(),
      password,
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
})

interface RegisterCredentials {
  email: string
  password: string
  userName: string
}

export const createUser = createAsyncThunk<
  User,
  RegisterCredentials,
  { rejectValue: string }
>(
  'auth/register',
  async ({ email, password, userName }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        userName,
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
  email: string
  newPassword: string
}

export const resetPassword = createAsyncThunk<
  void,
  ResetPasswordData,
  { rejectValue: string }
>('auth/resetPassword', async ({ email, newPassword }, { rejectWithValue }) => {
  try {
    await axios.post(`${API_URL}/auth/reset-password`, {
      email,
      newPassword,
    })
  } catch (error: any) {
    console.error('Password reset error:', error)
    return rejectWithValue(
      error.response?.data?.message || error.message || 'Password reset failed'
    )
  }
})

export const logoutUser = createAsyncThunk<null, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      sessionStorage.removeItem('user')
      return null
    } catch (error: any) {
      toast.error('Logout failed')
      return rejectWithValue(error.message)
    }
  }
)

// Initialize app - try to reconnect socket with existing token
export const initializeAuth = () => {
  return (dispatch: any) => {
    const storedUser = sessionStorage.getItem('user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        const token = userData.token || (userData.data && userData.data.token)

        if (token) {
          // Reconnect socket if we have a token
          socketClient.connect(token)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      }
    }
  }
}

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
    resetAuth: (state) => {
      state.isAuthLoading = false
      state.isAuthError = null
      state.isAuthSuccess = false
    },
    clearUser: (state) => {
      state.user = null
      state.token = null
      // Force the window location to the login page to ensure proper route change
      window.location.href = '/'
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

        // Properly extract token from either location in the response
        const token =
          action.payload.token ||
          (action.payload.data && action.payload.data.token)
        state.token = token
        state.isAuthError = null

        // Debug log to check payload structure
        console.log('Login response:', action.payload)

        // Initialize socket connection with token
        if (token) {
          console.log('Connecting socket with token:', token)
          socketClient.connect(token)
        } else {
          console.error('No token available for socket connection')
        }

        toast.success(
          `Welcome ${
            action.payload.userName ||
            (action.payload.data && action.payload.data.userName)
          }`
        )
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

        // Properly extract token from either location in the response
        const token =
          action.payload.token ||
          (action.payload.data && action.payload.data.token)
        state.token = token
        state.isAuthError = null

        // Debug log to check payload structure
        console.log('Registration response:', action.payload)

        // Initialize socket connection with token
        if (token) {
          console.log('Connecting socket with token:', token)
          socketClient.connect(token)
        } else {
          console.error('No token available for socket connection')
        }

        toast.success(
          `Welcome ${
            action.payload.userName ||
            (action.payload.data && action.payload.data.userName)
          }`
        )
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
        socketClient.disconnect()
        state.user = null
        state.isAuthSuccess = false
        state.isAuthError = null
        state.token = null
        state.isAuthLoading = false
        toast.success('Logged out successfully!')
        sessionStorage.clear()
        window.location.href = '/'
      })
  },
})

export const { setUser } = authSlice.actions
export default authSlice.reducer
