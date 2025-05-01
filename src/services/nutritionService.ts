import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'sonner'

// Define the interfaces for nutrient types
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
  weeklyData: any[]
  monthlyData: any[]
}

const initialState: NutritionState = {
  items: [],
  loading: false,
  error: null,
  }

// Get nutrition data for a user
export const fetchUserNutrition = createAsyncThunk(
  'nutrition/fetchUserNutrition',
  async (token: string, { rejectWithValue }) => {
    try {
      // Use absolute URL instead of relative path to avoid Vite dev server interference
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/nutrition/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )

      console.log('Raw API response:', response.data)

      // Check if response has the expected data structure
      if (response.data && response.data.success && response.data.data) {
        toast.success(`${response.data.message}`)
        console.log('Nutrition data:', response.data.data)

        // Return the items array from the paginated response
        return response.data.data.items || []
      } else {
        console.error('Unexpected response format:', response.data)
        return rejectWithValue('Unexpected response format from the server')
      }
    } catch (error: any) {
      console.error('Error fetching nutrition data:', error)
      // Log more detailed error information
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

// Add a new nutrition entry
export const addNutritionEntry = createAsyncThunk(
  'nutrition/addNutritionEntry',
  async (nutritionData: Partial<NutritionItem>, { rejectWithValue }) => {
    try {
      // Use absolute URL instead of relative path
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || ''}/api/nutrition`,
        nutritionData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem(
              'socket_auth_token'
            )}`,
          },
        }
      )

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
      // Log more detailed error information
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
