import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'

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

class SocketClient {
  private static instance: SocketClient
  private socket: Socket | null = null
  private API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private TOKEN_STORAGE_KEY = 'socket_auth_token'

  private constructor() {
    // Try to auto-connect when instance is created (for page refresh)
    this.autoConnect()

    // Handle page visibility changes to reconnect when tab becomes visible
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && !this.isConnected()) {
          this.autoConnect()
        }
      })
    }
  }

  private autoConnect(): void {
    const token = localStorage.getItem(this.TOKEN_STORAGE_KEY)
    if (token) {
      console.log('Auto-connecting socket with stored token')
      this.connect(token)
    }
  }

  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient()
    }
    return SocketClient.instance
  }

  public connect(token: string): void {
    // Store token for reconnection
    localStorage.setItem(this.TOKEN_STORAGE_KEY, token)

    if (this.socket && this.socket.connected) {
      console.log('Socket already connected, not reconnecting')
      return
    }

    // Cancel any pending reconnect
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    console.log('Initializing socket connection to:', this.API_URL)

    // Disconnect existing socket if any
    if (this.socket) {
      this.socket.disconnect()
    }

    // Initialize socket with auth token and increased timeout values
    this.socket = io(this.API_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      // Increase timeouts to prevent quick disconnections
      timeout: 20000,
      pingTimeout: 60000,
      pingInterval: 25000,
      transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
    })

    // Setup base event listeners
    this.socket.on(socketEvents.connect, () => {
      console.log('Socket connected successfully with ID:', this.socket?.id)
      toast.success('Connected to server')
    })

    this.socket.on(socketEvents.disconnect, (reason) => {
      console.log(`Socket disconnected: ${this.socket?.id}, Reason: ${reason}`)
      toast.warning(`Disconnected: ${this.formatDisconnectReason(reason)}`)

      // Attempt to reconnect if disconnected for specific reasons
      if (
        [
          'io server disconnect',
          'ping timeout',
          'transport close',
          'transport error',
        ].includes(reason)
      ) {
        this.scheduleReconnect()
      }
    })

    this.socket.on(socketEvents.error, (error) => {
      console.error('Socket error:', error)
      toast.error(
        `Socket error: ${
          typeof error === 'string' ? error : error.message || 'Unknown error'
        }`
      )
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message)
      toast.error(`Connection error: ${error.message}`)
      this.scheduleReconnect()
    })

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`Socket reconnected after ${attemptNumber} attempts`)
      toast.success(`Reconnected to server`)
    })

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Socket reconnection attempt #${attemptNumber}`)
    })

    this.socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error)
      toast.error(`Reconnection error: ${error.message}`)
    })

    this.socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed')
      toast.error('Failed to reconnect to server')
      this.scheduleReconnect(true)
    })
  }

  private formatDisconnectReason(reason: string): string {
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

  private scheduleReconnect(longDelay = false): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }

    const delay = longDelay ? 10000 : 3000
    console.log(`Scheduling reconnect in ${delay}ms`)

    this.reconnectTimer = setTimeout(() => {
      console.log('Attempting scheduled reconnect...')
      const token = localStorage.getItem(this.TOKEN_STORAGE_KEY)
      if (token) {
        this.connect(token)
      } else {
        console.error('No token available for reconnection')
        toast.error('Cannot reconnect - please log in again')
      }
      this.reconnectTimer = null
    }, delay)
  }

  public disconnect(): void {
    // Clear stored token
    localStorage.removeItem(this.TOKEN_STORAGE_KEY)

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  public emit<T>(event: string, data: T): void {
    if (!this.socket || !this.socket.connected) {
      toast.error('Socket not connected')
      return
    }
    this.socket.emit(event, data)
  }

  public on<T>(event: string, callback: (data: T) => void): void {
    if (!this.socket) {
      console.error('Socket not initialized')
      return
    }
    this.socket.on(event, callback)
  }

  public off(event: string): void {
    if (!this.socket) {
      return
    }
    this.socket.off(event)
  }

  // Nutrition analysis specific methods
  public startNutritionAnalysis(imageUrl: string): void {
    this.emit(socketEvents.nutritionAnalysisStart, { imageUrl })
  }

  public onNutritionProgress(callback: (data: ProgressUpdate) => void): void {
    this.on<ProgressUpdate>(socketEvents.nutritionAnalysisProgress, callback)
  }

  public onNutritionComplete(callback: (data: NutritionResult) => void): void {
    this.on<NutritionResult>(socketEvents.nutritionAnalysisComplete, callback)
  }

  public onNutritionError(callback: (data: { message: string }) => void): void {
    this.on<{ message: string }>(socketEvents.nutritionAnalysisError, callback)
  }

  public isConnected(): boolean {
    return !!this.socket && this.socket.connected
  }

  // Getter for connection status that can be used in the UI
  public getConnectionStatus(): {
    connected: boolean
    socketId: string | null
  } {
    return {
      connected: this.isConnected(),
      socketId: this.socket?.id || null,
    }
  }
}

// Export a singleton instance
export default SocketClient.getInstance()
