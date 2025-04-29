import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authService'
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['socket/connect/fulfilled'],
        ignoredActionPaths: ['payload.socket', 'meta.arg'],
        ignoredPaths: ['socket.socket', 'socket.events'],
      },
    }),
})

export default store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();