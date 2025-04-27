import { useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '@/services/store'
import {
  connectSocket,
  disconnectSocket,
  setConnected,
  registerEventListener,
  removeEventListener,
  socketEvents,
  ProgressUpdate,
  NutritionResult,
} from '@/services/socketService'

// Hook to access the socket connection
export const useSocket = () => {
  const { socket, connected, socketId } = useSelector(
    (state: RootState) => state.socket
  )
  const dispatch = useAppDispatch()

  const connect = useCallback(
    (token: string) => {
      dispatch(connectSocket(token))
    },
    [dispatch]
  )

  const disconnect = useCallback(() => {
    dispatch(disconnectSocket())
  }, [dispatch])

  const emit = useCallback(
    <T>(event: string, data: T) => {
      if (!socket || !connected) {
        console.error('Socket not connected')
        return
      }
      socket.emit(event, data)
    },
    [socket, connected]
  )

  const on = useCallback(
    <T>(event: string, callback: (data: T) => void) => {
      if (!socket) {
        console.error('Socket not initialized')
        return
      }

      // Register in our tracking system
      dispatch(registerEventListener({ event, callback }))

      // Actually set up the listener
      socket.on(event, callback)

      // Return cleanup function
      return () => {
        socket.off(event)
        dispatch(removeEventListener({ event }))
      }
    },
    [socket, dispatch]
  )

  const off = useCallback(
    (event: string) => {
      if (!socket) {
        return
      }
      socket.off(event)
      dispatch(removeEventListener({ event }))
    },
    [socket, dispatch]
  )

  // Nutrition analysis specific methods
  const startNutritionAnalysis = useCallback(
    (imageUrl: string) => {
      emit(socketEvents.nutritionAnalysisStart, { imageUrl })
    },
    [emit]
  )

  return {
    socket,
    connected,
    socketId,
    connect,
    disconnect,
    emit,
    on,
    off,
    startNutritionAnalysis,
  }
}

// Hook for nutrition analysis
export const useNutritionAnalysis = () => {
  const { on, startNutritionAnalysis } = useSocket()

  const onProgress = useCallback(
    (callback: (data: ProgressUpdate) => void) => {
      return on<ProgressUpdate>(
        socketEvents.nutritionAnalysisProgress,
        callback
      )
    },
    [on]
  )

  const onComplete = useCallback(
    (callback: (data: NutritionResult) => void) => {
      return on<NutritionResult>(
        socketEvents.nutritionAnalysisComplete,
        callback
      )
    },
    [on]
  )

  const onError = useCallback(
    (callback: (data: { message: string }) => void) => {
      return on<{ message: string }>(
        socketEvents.nutritionAnalysisError,
        callback
      )
    },
    [on]
  )

  return {
    startAnalysis: startNutritionAnalysis,
    onProgress,
    onComplete,
    onError,
  }
}

// Auto-reconnect hook (to be used in a top-level component)
export const useSocketAutoConnect = () => {
  const dispatch = useAppDispatch();
  const { connected } = useSelector((state: RootState) => state.socket);
  const token = localStorage.getItem('socket_auth_token');

  useEffect(() => {
    // Only connect if we don't already have a connection
    if (!connected && token) {
      dispatch(connectSocket(token));
    }

    // Don't add connected to dependencies as it would cause reconnection loops
  }, [dispatch, token]);
}