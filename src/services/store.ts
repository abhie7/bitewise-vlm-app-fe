// src/services/store.ts
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authService'
import socketReducer  from './socketService'
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['socket/connect/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.socket', 'meta.arg'],
        // Ignore these paths in the state
        ignoredPaths: ['socket.socket', 'socket.events'],
      },
    }),
})

export default store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();