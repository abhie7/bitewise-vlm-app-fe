import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL

export interface MacroNutrient {
  amount: number
  unit: string
  daily_value_percentage: number | null
  group: string
  category: string
  sub_nutrients?: {
    [key: string]: {
      amount: number
      unit: string
      daily_value_percentage: number | null
      group: string
      category: string
    }
  }
}

export interface MicroNutrient {
  amount: number
  unit: string
  daily_value_percentage: number | null
  group: string
  category: string
}

export interface NutritionItem {
  _id: string
  userId: string
  imageUrl: string
  imageId: string
  fileName: string
  fileType: string
  fileSize: number
  foodName: string
  calories: number
  carbs: number
  protein: number
  fat: number
  sugar: number
  fiber: number
  additionalInfo: string
  rawAnalysisData: {
    metadata: {
      confidence_score: number
      error_status: null | string
    }
    product_details: {
      serving_size: {
        amount: number
        unit: string
        type: null | string
      }
    }
    total_calories: number
    nutrients: {
      total_fat: MacroNutrient
      carbohydrates: MacroNutrient
      protein: MacroNutrient
      sodium?: MicroNutrient
      calcium?: MicroNutrient
      iron?: MicroNutrient
      cholesterol?: MicroNutrient
      [key: string]: MacroNutrient | MicroNutrient | undefined
    }
    ingredients: string[] | null
    allergens: string[] | null
  }
  createdAt: string
  updatedAt: string
}

export interface NutritionState {
  items: NutritionItem[]
  loading: boolean
  error: string | null
  dailyStats: {
    totalCalories: number
    totalCarbs: number
    totalProtein: number
    totalFat: number
    totalSugar: number
    totalFiber: number
  }
  weeklyData: Array<{
    date: string
    calories: number
    carbs: number
    protein: number
    fat: number
  }>
  monthlyData: Array<{
    month: string
    calories: number
    carbs: number
    protein: number
    fat: number
  }>
}

const initialState: NutritionState = {
  items: [],
  loading: false,
  error: null,
  dailyStats: {
    totalCalories: 0,
    totalCarbs: 0,
    totalProtein: 0,
    totalFat: 0,
    totalSugar: 0,
    totalFiber: 0
  },
  weeklyData: [],
  monthlyData: []
}

export const fetchUserNutrition = createAsyncThunk(
  'nutrition/fetchUserNutrition',
  async (token: string, { rejectWithValue }) => {
    try {
      let allItems: NutritionItem[] = []
      let page = 1
      const limit = 50

      while (true) {
        const response = await axios.get(`${API_URL}/nutrition`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          params: {
            page,
            limit,
          },
        })

        if (
          response.data &&
          response.data.success &&
          response.data.data &&
          Array.isArray(response.data.data.items)
        ) {
          const { items, pagination } = response.data.data

          allItems = [...allItems, ...items]

          // Check if we have fetched all pages
          if (page >= pagination.totalPages) {
            break
          }

          page++
        } else {
          console.error('Unexpected response format:', response.data)
          return rejectWithValue('Unexpected response format from the server')
        }
      }

      toast.success(`Fetched ${allItems.length} nutrition entries`)
      return allItems
    } catch (error: any) {
      console.error('Error fetching nutrition data:', error)

      if (error.response) {
        console.error('Response data:', error.response.data)
        console.error('Response status:', error.response.status)
        console.error('Response headers:', error.response.headers)
      }
      toast.error(`Failed to fetch nutrition data: ${error.message}`)
      return rejectWithValue(error.message)
    }
  }
)

export const addNutritionEntry = createAsyncThunk(
  'nutrition/addNutritionEntry',
  async (nutritionData: Partial<NutritionItem>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/nutrition`, nutritionData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('socket_auth_token')}`,
        },
      })

      console.log('Raw API response:', response)

      if (response.data && response.data.success && response.data.data) {
        toast.success('Nutrition entry added successfully')
        return response.data.data
      } else {
        console.error('Unexpected response format:', response.data)
        return rejectWithValue('Unexpected response format from the server')
      }
    } catch (error: any) {
      console.error('Error adding nutrition entry:', error)

      if (error.response) {
        console.error('Response data:', error.response.data)
        console.error('Response status:', error.response.status)
        console.error('Response headers:', error.response.headers)
      }
      toast.error(`Failed to add nutrition entry: ${error.message}`)
      return rejectWithValue(error.message)
    }
  }
)

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserNutrition.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchUserNutrition.fulfilled,
        (state, action: PayloadAction<NutritionItem[]>) => {
          state.items = action.payload
          state.loading = false

          // Calculate daily stats
          state.dailyStats = action.payload.reduce(
            (acc, item) => ({
              totalCalories: acc.totalCalories + item.calories,
              totalCarbs: acc.totalCarbs + item.carbs,
              totalProtein: acc.totalProtein + item.protein,
              totalFat: acc.totalFat + item.fat,
              totalSugar: acc.totalSugar + item.sugar,
              totalFiber: acc.totalFiber + item.fiber,
            }),
            {
              totalCalories: 0,
              totalCarbs: 0,
              totalProtein: 0,
              totalFat: 0,
              totalSugar: 0,
              totalFiber: 0,
            }
          )

          // Calculate weekly data
          const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - i)
            return date.toLocaleDateString()
          }).reverse()

          state.weeklyData = last7Days.map(date => {
            const dayItems = action.payload.filter(
              item => new Date(item.createdAt).toLocaleDateString() === date
            )
            return {
              date,
              calories: dayItems.reduce((sum, item) => sum + item.calories, 0),
              carbs: dayItems.reduce((sum, item) => sum + item.carbs, 0),
              protein: dayItems.reduce((sum, item) => sum + item.protein, 0),
              fat: dayItems.reduce((sum, item) => sum + item.fat, 0),
            }
          })

          // Calculate monthly data
          const last6Months = Array.from({ length: 6 }, (_, i) => {
            const date = new Date()
            date.setMonth(date.getMonth() - i)
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          }).reverse()

          state.monthlyData = last6Months.map(month => {
            const monthItems = action.payload.filter(item => {
              const itemDate = new Date(item.createdAt)
              const itemMonth = itemDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
              return itemMonth === month
            })
            return {
              month,
              calories: monthItems.reduce((sum, item) => sum + item.calories, 0),
              carbs: monthItems.reduce((sum, item) => sum + item.carbs, 0),
              protein: monthItems.reduce((sum, item) => sum + item.protein, 0),
              fat: monthItems.reduce((sum, item) => sum + item.fat, 0),
            }
          })
        }
      )
      .addCase(fetchUserNutrition.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(
        addNutritionEntry.fulfilled,
        (state, action: PayloadAction<NutritionItem>) => {
          state.items.push(action.payload)
        }
      )
  },
})

export default nutritionSlice.reducer
