import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'

// Socket events - should match backend events
export const socketEvents = {
  connect: 'connect',
  disconnect: 'disconnect',
  error: 'error',
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
  private SOCKET_ID_KEY = 'socket_id';


  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient()
    }
    return SocketClient.instance
  }

  public connect(token: string): void {
    localStorage.setItem(this.TOKEN_STORAGE_KEY, token);

    if (this.socket && this.socket.connected) {
      console.log('Socket already connected with ID:', this.socket.id);
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    console.log('Initializing socket connection to:', this.API_URL);

    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(this.API_URL, {
      transports: ['websocket', 'polling'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    this.socket.on(socketEvents.connect, () => {
      console.log('Socket connected successfully with ID:', this.socket?.id);
      if (this.socket?.id) {
        localStorage.setItem(this.SOCKET_ID_KEY, this.socket.id);
      }
      toast.success('Connected to server');
    });

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

  public isConnected(): boolean {
    return !!this.socket && this.socket.connected
  }

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

export default SocketClient.getInstance()
