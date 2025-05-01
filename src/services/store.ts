import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
// Import existing reducers
import authReducer from './authService'
// Import our new reducer
import nutritionReducer from './nutritionService'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    nutrition: nutritionReducer,
  },
})

export default store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();