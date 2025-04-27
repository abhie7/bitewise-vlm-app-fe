// src/services/socketService.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'
import { RootState } from './store'

// Socket events - should match backend events
export const socketEvents = {
  connect: 'connect',
  disconnect: 'disconnect',
  error: 'error',
  nutritionAnalysisStart: 'nutrition-analysis-start',
  nutritionAnalysisProgress: 'nutrition-analysis-progress',
  nutritionAnalysisComplete: 'nutrition-analysis-complete',
  nutritionAnalysisError: 'nutrition-analysis-error',
}

export type ProgressUpdate = {
  progress: number
  message: string
}

export type NutritionResult = {
  foodName: string
  calories: number
  carbs: number
  protein: number
  fat: number
  sugar: number
  fiber: number
  additionalInfo: string
}

interface SocketState {
  connected: boolean
  socketId: string | null
  socket: Socket | null
  token: string | null
  events: Record<string, Array<(data: any) => void>>
}

const initialState: SocketState = {
  connected: false,
  socketId: null,
  socket: null,
  token: null,
  events: {}
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const TOKEN_STORAGE_KEY = 'socket_auth_token'

// Connect to socket
export const connectSocket = createAsyncThunk<
    { socket: Socket; token: string },
  string,
  { state: RootState }
>('socket/connect',
  async (token: string, { getState, dispatch }) => {
    // Check if already connected with the same token
    const currentState = getState().socket;
    if (currentState.socket?.connected) {
      console.log('Socket already connected, reusing existing connection');
      return { socket: currentState.socket, token };
    }

    // Store token for reconnection
    localStorage.setItem(TOKEN_STORAGE_KEY, token);

    // Disconnect existing socket if any
    if (currentState.socket) {
      currentState.socket.disconnect();
    }

    console.log('Initializing socket connection to:', API_URL);

    // Initialize socket with auth token
    const socket = io(API_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
      pingTimeout: 60000,
      pingInterval: 25000,
      transports: ['websocket', 'polling'],
    });

    // Set up basic event listeners
    socket.on(socketEvents.connect, () => {
      console.log('Socket connected successfully with ID:', socket.id);
      dispatch(setConnected({ connected: true, socketId: socket.id }));
      // Store socket ID in local storage
      localStorage.setItem('socket_id', socket.id);
      toast.success('Connected to server');
    });

    socket.on(socketEvents.disconnect, (reason) => {
      console.log(`Socket disconnected: ${socket.id}, Reason: ${reason}`)
      dispatch(setConnected({ connected: false, socketId: null }))
      toast.warning(`Disconnected: ${formatDisconnectReason(reason)}`)
    })

    socket.on(socketEvents.error, (error) => {
      console.error('Socket error:', error)
      toast.error(
        `Socket error: ${
          typeof error === 'string' ? error : error.message || 'Unknown error'
        }`
      )
    })

    // Return the socket and token to be stored in state
    return { socket, token }
  }
)

// Disconnect from socket
export const disconnectSocket = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('socket/disconnect',
  async (_, { getState }) => {
    // Clear stored token
    localStorage.removeItem(TOKEN_STORAGE_KEY)

    const socket = getState().socket.socket
    if (socket) {
      socket.disconnect()
    }
  }
)

// Helper function to format disconnect reason
function formatDisconnectReason(reason: string): string {
  switch (reason) {
    case 'io server disconnect':
      return 'Server disconnected'
    case 'io client disconnect':
      return 'Client disconnected'
    case 'ping timeout':
      return 'Connection timed out'
    case 'transport close':
      return 'Connection lost'
    case 'transport error':
      return 'Network error'
    default:
      return reason
  }
}

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<{connected: boolean, socketId: string | null}>) => {
      state.connected = action.payload.connected
      state.socketId = action.payload.socketId
    },
    registerEventListener: (state, action: PayloadAction<{event: string, callback: (data: any) => void}>) => {
      const { event, callback } = action.payload
      if (!state.events[event]) {
        state.events[event] = []
      }
      // We can't really store functions in Redux, but we'll maintain the structure
      // The actual listener registration will happen in our hooks
      state.events[event].push(callback)
    },
    removeEventListener: (state, action: PayloadAction<{event: string}>) => {
      const { event } = action.payload
      delete state.events[event]
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectSocket.fulfilled, (state, action) => {
        state.socket = action.payload.socket
        state.token = action.payload.token
      })
      .addCase(disconnectSocket.fulfilled, (state) => {
        state.socket = null
        state.token = null
        state.connected = false
        state.socketId = null
        state.events = {}
      })
  }
})

export const { setConnected, registerEventListener, removeEventListener } = socketSlice.actions
export default socketSlice.reducer